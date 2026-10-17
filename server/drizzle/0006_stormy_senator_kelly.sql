CREATE TYPE "public"."verify_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "donors" RENAME COLUMN "approved" TO "verify_status";--> statement-breakpoint
ALTER TABLE "donor_documents" ADD CONSTRAINT "donor_documents_donor_id_unique" UNIQUE("donor_id");--> statement-breakpoint
ALTER TABLE "donor_facilities" ADD CONSTRAINT "donor_facilities_donor_id_unique" UNIQUE("donor_id");