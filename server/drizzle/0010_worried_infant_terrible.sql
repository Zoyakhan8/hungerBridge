ALTER TABLE "ngos" ADD COLUMN "verify_status" "status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "ngos" DROP COLUMN "approved";