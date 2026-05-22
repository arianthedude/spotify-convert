import { pgTable, serial, text, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),
  
  title: text('title').notNull(),
  
  artist: text('artist').notNull(),
  
  spotifyUrl: text('spotify_url').notNull().unique(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // Melodify integration fields
  melodifyLiked: boolean('melodify_liked').default(false).notNull(),
  
  melodifyLikedAt: timestamp('melodify_liked_at'),
  
  melodifyTrackId: integer('melodify_track_id'),
  
  melodifyMatchScore: decimal('melodify_match_score', { precision: 3, scale: 2 }), // e.g., 0.95
  
  // Track sync status
  melodifySyncStatus: text('melodify_sync_status').$type<'pending' | 'success' | 'failed' | 'not_found'>().default('pending'),
  
  lastSyncAttempt: timestamp('last_sync_attempt'),
  
  syncError: text('sync_error'),
});

// Export type for TypeScript
export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;