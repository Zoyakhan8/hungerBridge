ALTER TABLE "donations" ALTER COLUMN "expectedExpiryTime" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "created_at" timestamp DEFAULT now();