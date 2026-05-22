"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.songs = (0, pg_core_1.pgTable)('songs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    artist: (0, pg_core_1.text)('artist').notNull(),
    spotifyUrl: (0, pg_core_1.text)('spotify_url').notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    melodifyLiked: (0, pg_core_1.boolean)('melodify_liked').default(false).notNull(),
    melodifyLikedAt: (0, pg_core_1.timestamp)('melodify_liked_at'),
    melodifyTrackId: (0, pg_core_1.integer)('melodify_track_id'),
    melodifyMatchScore: (0, pg_core_1.decimal)('melodify_match_score', { precision: 3, scale: 2 }),
    melodifySyncStatus: (0, pg_core_1.text)('melodify_sync_status').$type().default('pending'),
    lastSyncAttempt: (0, pg_core_1.timestamp)('last_sync_attempt'),
    syncError: (0, pg_core_1.text)('sync_error'),
});
//# sourceMappingURL=schema.js.map