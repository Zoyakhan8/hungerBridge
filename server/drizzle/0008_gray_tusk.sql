ALTER TABLE "donors" DROP COLUMN "verification_status" ;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "verify_status" "status" DEFAULT 'pending' NOT NULL;