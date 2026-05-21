import { Injectable, Inject } from '@nestjs/common';
import { chromium } from 'playwright';
import * as fs from 'fs';
import { songs as songsTable } from 'src/db/schema';

@Injectable()
export class SpotifyService {
  constructor(
    @Inject('DRIZZLE')
    private db: any,
  ) {}

  async scrapeSongs() {
    console.log('🚀 Scraper started');

    const browser = await chromium.launch({
      headless: false,
      slowMo: 20,
    });

    const hasAuth = fs.existsSync('auth.json');

    const context = await browser.newContext(
      hasAuth ? { storageState: 'auth.json' } : {},
    );

    const page = await context.newPage();
    page.setDefaultTimeout(0);

    // ---------------- LOGIN ----------------
    if (!hasAuth) {
      console.log('🔐 Manual login required');

      await page.goto('https://open.spotify.com', {
        waitUntil: 'domcontentloaded',
      });

      await page.waitForSelector('[data-testid="user-widget-link"]', {
        timeout: 0,
      });

      await context.storageState({ path: 'auth.json' });

      console.log('💾 Session saved');
    } else {
      console.log('♻️ Using saved session');
    }

    // ---------------- OPEN LIKED SONGS ----------------
    console.log('➡️ Opening liked songs...');

    await page.goto('https://open.spotify.com/collection/tracks', {
      waitUntil: 'domcontentloaded',
    });

    console.log('⏳ Waiting for rows to actually render...');

    // ---------------- IMPORTANT FIX ----------------
    // wait until REAL rows exist (not just container)
    await page.waitForFunction(() => {
      return document.querySelectorAll('div[role="row"]').length > 0;
    });

    console.log('🎧 Rows detected, starting scrape');

    const seen = new Set<string>();

    let noProgress = 0;
    let lastSeenSize = 0;

    while (noProgress < 15) {
      console.log(`\n➡️ Loop start (noProgress=${noProgress})`);

      // ---------------- SAFE SCRAPE ----------------
      const batch = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('div[role="row"]'));

        console.log('rows in DOM:', rows.length);

        return rows
          .map((row) => {
            const titleEl = row.querySelector(
              '[data-testid="internal-track-link"]',
            ) as HTMLElement | null;

            if (!titleEl) return null;

            const href = titleEl.getAttribute('href');
            const title = titleEl.textContent?.trim();

            if (!href || !title) return null;

            const artistEl = row.querySelector('a[href*="/artist/"]');
            const artist = artistEl?.textContent?.trim() || 'Unknown';

            return {
              title,
              href,
              artist,
            };
          })
          .filter(Boolean) as {
          title: string;
          href: string;
          artist: string;
        }[];
      });

      console.log(`📦 Visible items: ${batch.length}`);

      let newItems = 0;

      for (const item of batch) {
        const spotifyUrl = `https://open.spotify.com${item.href}`;

        if (seen.has(spotifyUrl)) continue;
        seen.add(spotifyUrl);

        newItems++;

        console.log(`💾 ${item.title} - ${item.artist}`);

        await this.db
          .insert(songsTable)
          .values({
            title: item.title,
            artist: item.artist,
            spotifyUrl,
          })
          .onConflictDoNothing();
      }

      console.log(`➡️ New items this round: ${newItems}`);
      console.log(`➡️ Total saved: ${seen.size}`);

      // ---------------- SAFE SCROLL (FIXED) ----------------
      await page.evaluate(() => {
        const container =
          document.querySelector('[data-testid="main-view-container"]') ||
          document.querySelector('main') ||
          document.body;

        container.scrollBy(0, 2000);
      });

      await page.waitForTimeout(2500);

      // ---------------- PROGRESS CHECK ----------------
      if (seen.size === lastSeenSize) {
        noProgress++;
      } else {
        noProgress = 0;
      }

      lastSeenSize = seen.size;

      console.log(`🧠 noProgress=${noProgress}`);
    }

    console.log(`\n✅ DONE → ${seen.size} songs scraped`);

    await browser.close();

    return {
      total: seen.size,
    };
  }
} 