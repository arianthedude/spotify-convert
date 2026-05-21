import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),

  title: text('title').notNull(),

  artist: text('artist').notNull(),

  spotifyUrl: text('spotify_url').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});