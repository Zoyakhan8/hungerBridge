ALTER TABLE "donations" ADD COLUMN "created_At" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "donations" DROP COLUMN "created_at";