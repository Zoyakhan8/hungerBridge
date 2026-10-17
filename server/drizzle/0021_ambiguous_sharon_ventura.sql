ALTER TABLE "donations" RENAME COLUMN "quantity" TO "quanitity";--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "prepared_date_time" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "prepared_date_time" DROP NOT NULL;