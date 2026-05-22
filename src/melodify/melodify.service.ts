import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { songs } from '../db/schema';

type Song = typeof songs.$inferSelect;

@Injectable()
export class MelodifyService {
  private readonly logger = new Logger(MelodifyService.name);

  private readonly REQUEST_DELAY = 10000;
  private readonly MAX_RETRIES = 3;

  constructor(
    @Inject('DRIZZLE')
    private readonly db: any,
  ) {}

  private melodify = axios.create({
    baseURL: 'https://melodify.pw/api/desktop/v9',
    headers: {
      'app-version': '9.1.3',
      'pwa-version': '9.2.2 Desktop',
      platform: 'Mac OS-Desktop',
      'device-id': process.env.MELODIFY_DEVICE_ID,
      'device-token': process.env.MELODIFY_DEVICE_TOKEN,
      'user-id': process.env.MELODIFY_USER_ID,
      authorization: process.env.MELODIFY_TOKEN,
      'Content-Type': 'application/json',
      Origin: 'https://desktop.melodify.app',
      Referer: 'https://desktop.melodify.app/',
    },
  });

  // =====================================================
  // MAIN SYNC
  // =====================================================
  async syncSongsToMelodify() {
    this.logger.log('🚀 Starting Melodify sync');

const allSongs: Song[] = await this.db
  .select()
  .from(songs)
  .where(eq(songs.melodifySyncStatus, 'pending'));
  
    this.logger.log(`📦 Loaded songs: ${allSongs.length}`);

    for (const song of allSongs) {
      try {
        this.logger.log(`\n--------------------------------`);
        this.logger.log(`🔍 Searching: ${song.title} - ${song.artist}`);

        const match = await this.findBestTrack(song);

        this.logger.log(`🎯 MATCH RESULT:`);
        // this.logger.log(JSON.stringify(match, null, 2));

        if (!match?.id) {
          this.logger.warn(`❌ No valid track id found`);
          await this.markFailed(song.id, 'No track found');
          continue;
        }

        await this.retry(() => this.likeTrack(match.id));

        this.logger.log(`💾 Liked track ID: ${match.id}`);

        await this.db
          .update(songs)
          .set({
            melodifyLiked: true,
            melodifyLikedAt: new Date(),
            melodifyTrackId: match.id,
            melodifyMatchScore: '0.80',
            melodifySyncStatus: 'success',
            lastSyncAttempt: new Date(),
            syncError: null,
          })
          .where(eq(songs.id, song.id));
      } catch (err: any) {
        this.logger.error(`❌ Sync error: ${song.title}`);
        this.logger.error(err?.response?.data ?? err?.message ?? err);

        await this.markFailed(song.id, err?.message ?? 'unknown error');
      }

      // IMPORTANT: prevent 429
      await this.delay(this.REQUEST_DELAY);
    }
  }

  // =====================================================
  // SEARCH
  // =====================================================
  private async findBestTrack(song: Song) {
    const query = `${song.title} - ${song.artist}`;

    this.logger.log(`🔎 SEARCH QUERY: ${query}`);

    const res = await this.melodify.post('/search', {
      q: query,
      type: 6,
      offset: 0,
    });

    const data = res.data;

    const rawTracks = data?.result?.tracks;

    const tracks = Array.isArray(rawTracks)
      ? rawTracks
      : rawTracks
        ? Object.values(rawTracks)
        : [];

    this.logger.log(`🎵 TRACK COUNT: ${tracks.length}`);

    if (!tracks.length) {
      this.logger.warn(`❌ No tracks found`);
      return null;
    }

    const best = tracks[0] as any;

    const normalized = {
      id: best?.track?.id ?? best?.id ?? null,
      title: best?.track?.title ?? best?.title,
      raw: best,
    };

    // this.logger.log(`🧼 NORMALIZED MATCH: ${JSON.stringify(normalized)}`);

    return normalized;
  }

  // =====================================================
  // LIKE WITH RETRY (FIX FOR 429)
  // =====================================================
  private async likeTrack(trackId: number) {
    this.logger.log(`❤️ LIKING TRACK: ${trackId}`);

    const res = await this.melodify.post('/trackLike', {
      track_id: trackId,
    });

    this.logger.log(`📡 LIKE RESPONSE: ${JSON.stringify(res.data)}`);

    return res.data;
  }

  private async retry<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit =
        err?.response?.status === 429 ||
        err?.message?.includes('Too Many Attempts');

      if (isRateLimit && attempt < this.MAX_RETRIES) {
        const wait = 1000 * Math.pow(2, attempt);
        this.logger.warn(`⏳ 429 hit → retrying in ${wait}ms`);

        await this.delay(wait);
        return this.retry(fn, attempt + 1);
      }

      throw err;
    }
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // =====================================================
  // FAIL HANDLING
  // =====================================================
  private async markFailed(songId: number, error: string) {
    this.logger.error(`🧨 MARK FAILED: ${songId} => ${error}`);

    await this.db
      .update(songs)
      .set({
        melodifySyncStatus: 'failed',
        lastSyncAttempt: new Date(),
        syncError: error,
      })
      .where(eq(songs.id, songId));
  }
}
