ALTER TABLE "donations" RENAME COLUMN "elapsedMinutes" TO "elapsed_minutes";--> statement-breakpoint
ALTER TABLE "donations" RENAME COLUMN "maxTimeMinutes" TO "maxTime_minutes";--> statement-breakpoint
ALTER TABLE "donations" RENAME COLUMN "remainingMinutes" TO "remaining_minutes";--> statement-breakpoint
ALTER TABLE "donations" RENAME COLUMN "expectedExpiryTime" TO "expected_expiry_time";