ALTER TABLE "donorFacilities" RENAME TO "donor_facilities";--> statement-breakpoint
ALTER TABLE "donor_facilities" DROP CONSTRAINT "donorFacilities_donor_id_donors_id_fk";
--> statement-breakpoint
ALTER TABLE "donor_facilities" ADD CONSTRAINT "donor_facilities_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE cascade ON UPDATE no action;