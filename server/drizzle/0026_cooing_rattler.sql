CREATE TYPE "public"."delivery_status" AS ENUM('pending', 'assigned', 'in_transit', 'delivered', 'cancelled');--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'delivery_partner';--> statement-breakpoint
CREATE TABLE "delivery_partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"vehicle_type" text,
	"vehicle_number" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_partners_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"delivery_partner_id" integer,
	"status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"qr_token" text,
	"pickup_scanned_at" timestamp with time zone,
	"handover_scanned_at" timestamp with time zone,
	"assigned_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deliveries_request_id_unique" UNIQUE("request_id"),
	CONSTRAINT "deliveries_qr_token_unique" UNIQUE("qr_token")
);
--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "ngos" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "ngos" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "delivery_partners" ADD CONSTRAINT "delivery_partners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_request_id_donation_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."donation_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_delivery_partner_id_delivery_partners_id_fk" FOREIGN KEY ("delivery_partner_id") REFERENCES "public"."delivery_partners"("id") ON DELETE set null ON UPDATE no action;