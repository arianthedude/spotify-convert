"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MelodifyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MelodifyService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const axios_1 = __importDefault(require("axios"));
const schema_1 = require("../db/schema");
let MelodifyService = MelodifyService_1 = class MelodifyService {
    db;
    logger = new common_1.Logger(MelodifyService_1.name);
    REQUEST_DELAY = 10000;
    MAX_RETRIES = 3;
    constructor(db) {
        this.db = db;
    }
    melodify = axios_1.default.create({
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
    async syncSongsToMelodify() {
        this.logger.log('🚀 Starting Melodify sync');
        const allSongs = await this.db
            .select()
            .from(schema_1.songs)
            .where((0, drizzle_orm_1.eq)(schema_1.songs.melodifySyncStatus, 'pending'));
        this.logger.log(`📦 Loaded songs: ${allSongs.length}`);
        for (const song of allSongs) {
            try {
                this.logger.log(`\n--------------------------------`);
                this.logger.log(`🔍 Searching: ${song.title} - ${song.artist}`);
                const match = await this.findBestTrack(song);
                this.logger.log(`🎯 MATCH RESULT:`);
                if (!match?.id) {
                    this.logger.warn(`❌ No valid track id found`);
                    await this.markFailed(song.id, 'No track found');
                    continue;
                }
                await this.retry(() => this.likeTrack(match.id));
                this.logger.log(`💾 Liked track ID: ${match.id}`);
                await this.db
                    .update(schema_1.songs)
                    .set({
                    melodifyLiked: true,
                    melodifyLikedAt: new Date(),
                    melodifyTrackId: match.id,
                    melodifyMatchScore: '0.80',
                    melodifySyncStatus: 'success',
                    lastSyncAttempt: new Date(),
                    syncError: null,
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.songs.id, song.id));
            }
            catch (err) {
                this.logger.error(`❌ Sync error: ${song.title}`);
                this.logger.error(err?.response?.data ?? err?.message ?? err);
                await this.markFailed(song.id, err?.message ?? 'unknown error');
            }
            await this.delay(this.REQUEST_DELAY);
        }
    }
    async findBestTrack(song) {
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
        const best = tracks[0];
        const normalized = {
            id: best?.track?.id ?? best?.id ?? null,
            title: best?.track?.title ?? best?.title,
            raw: best,
        };
        return normalized;
    }
    async likeTrack(trackId) {
        this.logger.log(`❤️ LIKING TRACK: ${trackId}`);
        const res = await this.melodify.post('/trackLike', {
            track_id: trackId,
        });
        this.logger.log(`📡 LIKE RESPONSE: ${JSON.stringify(res.data)}`);
        return res.data;
    }
    async retry(fn, attempt = 1) {
        try {
            return await fn();
        }
        catch (err) {
            const isRateLimit = err?.response?.status === 429 ||
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
    delay(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }
    async markFailed(songId, error) {
        this.logger.error(`🧨 MARK FAILED: ${songId} => ${error}`);
        await this.db
            .update(schema_1.songs)
            .set({
            melodifySyncStatus: 'failed',
            lastSyncAttempt: new Date(),
            syncError: error,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.songs.id, songId));
    }
};
exports.MelodifyService = MelodifyService;
exports.MelodifyService = MelodifyService = MelodifyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DRIZZLE')),
    __metadata("design:paramtypes", [Object])
], MelodifyService);
//# sourceMappingURL=melodify.service.js.map