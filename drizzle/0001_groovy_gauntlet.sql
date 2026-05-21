ALTER TABLE "user_songs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_songs" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "songs" DROP CONSTRAINT "songs_spotify_id_unique";--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN "spotify_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "spotify_id";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "album";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "duration_ms";--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_spotify_url_unique" UNIQUE("spotify_url");