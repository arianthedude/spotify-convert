"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSongs = exports.songs = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    spotifyId: (0, pg_core_1.text)("spotify_id").unique().notNull(),
    displayName: (0, pg_core_1.text)("display_name"),
    email: (0, pg_core_1.text)("email"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.songs = (0, pg_core_1.pgTable)("songs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    spotifyId: (0, pg_core_1.text)("spotify_id").unique().notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    album: (0, pg_core_1.text)("album"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    durationMs: (0, pg_core_1.integer)("duration_ms"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.userSongs = (0, pg_core_1.pgTable)("user_songs", {
    userId: (0, pg_core_1.uuid)("user_id").notNull(),
    songId: (0, pg_core_1.uuid)("song_id").notNull(),
    addedAt: (0, pg_core_1.timestamp)("added_at").defaultNow(),
});
//# sourceMappingURL=schema.js.map