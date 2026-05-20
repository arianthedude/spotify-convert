import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  spotifyId: text("spotify_id").unique().notNull(),
  displayName: text("display_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const songs = pgTable("songs", {
  id: uuid("id").defaultRandom().primaryKey(),
  spotifyId: text("spotify_id").unique().notNull(),
  name: text("name").notNull(),
  album: text("album"),
  imageUrl: text("image_url"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt:timestamp("created_at").defaultNow(), 
});

export const userSongs = pgTable("user_songs", {
  userId: uuid("user_id").notNull(),
  songId: uuid("song_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});