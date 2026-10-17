CREATE TABLE "donor_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"donor_id" integer NOT NULL,
	"aadhar_url" text,
	"shop_license_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donorFacilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"donor_id" integer NOT NULL,
	"refrigerator" boolean DEFAULT false NOT NULL,
	"total_refrigerator" integer,
	"refrigerator_temperature" numeric(5, 2),
	"freezer" boolean DEFAULT false NOT NULL,
	"total_freezer" integer,
	"freezer_temperature" numeric(5, 2),
	"kitchen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "donor_documents" ADD CONSTRAINT "donor_documents_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donorFacilities" ADD CONSTRAINT "donorFacilities_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donors" DROP COLUMN "aadhar_url";--> statement-breakpoint
ALTER TABLE "donors" DROP COLUMN "shop_license_url";