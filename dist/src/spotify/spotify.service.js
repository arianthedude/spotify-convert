"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyService = void 0;
const common_1 = require("@nestjs/common");
const playwright_1 = require("playwright");
const fs = __importStar(require("fs"));
const schema_1 = require("../db/schema");
let SpotifyService = class SpotifyService {
    db;
    constructor(db) {
        this.db = db;
    }
    async scrapeSongs() {
        console.log('🚀 Scraper started');
        const browser = await playwright_1.chromium.launch({
            headless: false,
            slowMo: 20,
        });
        const hasAuth = fs.existsSync('auth.json');
        const context = await browser.newContext(hasAuth ? { storageState: 'auth.json' } : {});
        const page = await context.newPage();
        page.setDefaultTimeout(0);
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
        }
        else {
            console.log('♻️ Using saved session');
        }
        console.log('➡️ Opening liked songs...');
        await page.goto('https://open.spotify.com/collection/tracks', {
            waitUntil: 'domcontentloaded',
        });
        console.log('⏳ Waiting for rows to actually render...');
        await page.waitForFunction(() => {
            return document.querySelectorAll('div[role="row"]').length > 0;
        });
        console.log('🎧 Rows detected, starting scrape');
        const seen = new Set();
        let noProgress = 0;
        let lastSeenSize = 0;
        while (noProgress < 15) {
            console.log(`\n➡️ Loop start (noProgress=${noProgress})`);
            const batch = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('div[role="row"]'));
                console.log('rows in DOM:', rows.length);
                return rows
                    .map((row) => {
                    const titleEl = row.querySelector('[data-testid="internal-track-link"]');
                    if (!titleEl)
                        return null;
                    const href = titleEl.getAttribute('href');
                    const title = titleEl.textContent?.trim();
                    if (!href || !title)
                        return null;
                    const artistEl = row.querySelector('a[href*="/artist/"]');
                    const artist = artistEl?.textContent?.trim() || 'Unknown';
                    return {
                        title,
                        href,
                        artist,
                    };
                })
                    .filter(Boolean);
            });
            console.log(`📦 Visible items: ${batch.length}`);
            let newItems = 0;
            for (const item of batch) {
                const spotifyUrl = `https://open.spotify.com${item.href}`;
                if (seen.has(spotifyUrl))
                    continue;
                seen.add(spotifyUrl);
                newItems++;
                console.log(`💾 ${item.title} - ${item.artist}`);
                await this.db
                    .insert(schema_1.songs)
                    .values({
                    title: item.title,
                    artist: item.artist,
                    spotifyUrl,
                })
                    .onConflictDoNothing();
            }
            console.log(`➡️ New items this round: ${newItems}`);
            console.log(`➡️ Total saved: ${seen.size}`);
            await page.evaluate(() => {
                const container = document.querySelector('[data-testid="main-view-container"]') ||
                    document.querySelector('main') ||
                    document.body;
                container.scrollBy(0, 2000);
            });
            await page.waitForTimeout(2500);
            if (seen.size === lastSeenSize) {
                noProgress++;
            }
            else {
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
};
exports.SpotifyService = SpotifyService;
exports.SpotifyService = SpotifyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DRIZZLE')),
    __metadata("design:paramtypes", [Object])
], SpotifyService);
//# sourceMappingURL=spotify.service.js.map