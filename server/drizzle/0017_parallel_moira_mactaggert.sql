CREATE TYPE "public"."donation_request_status" AS ENUM('pending', 'accepted', 'declined', 'cancelled');--> statement-breakpoint
CREATE TABLE "donation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"donation_id" integer NOT NULL,
	"ngo_id" integer NOT NULL,
	"status" "donation_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	CONSTRAINT "donation_request_unique" UNIQUE("donation_id","ngo_id")
);
--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "prepared_date_time" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "donation_requests" ADD CONSTRAINT "donation_requests_donation_id_donations_donation_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("donation_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donation_requests" ADD CONSTRAINT "donation_requests_ngo_id_ngos_id_fk" FOREIGN KEY ("ngo_id") REFERENCES "public"."ngos"("id") ON DELETE cascade ON UPDATE no action;