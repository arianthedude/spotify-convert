CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spotify_id" text NOT NULL,
	"name" text NOT NULL,
	"album" text,
	"image_url" text,
	"duration_ms" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "songs_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
CREATE TABLE "user_songs" (
	"user_id" uuid NOT NULL,
	"song_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spotify_id" text NOT NULL,
	"display_name" text,
	"email" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_spotify_id_unique" UNIQUE("spotify_id")
);
