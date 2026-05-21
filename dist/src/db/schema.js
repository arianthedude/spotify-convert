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
});
//# sourceMappingURL=schema.js.map