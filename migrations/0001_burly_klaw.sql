ALTER TABLE "user" RENAME COLUMN "google" TO "google_id";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_google_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "given_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "family_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_google_id_unique" UNIQUE("google_id");