CREATE TYPE "public"."food_type" AS ENUM('veg', 'non_veg');--> statement-breakpoint
CREATE TYPE "public"."storage_history" AS ENUM('room_temp', 'refrigerator', 'freezer');--> statement-breakpoint
CREATE TABLE "donations" (
	"donation_id" serial PRIMARY KEY NOT NULL,
	"donor_id" integer NOT NULL,
	"food_name" text NOT NULL,
	"food_type" "food_type" DEFAULT 'veg' NOT NULL,
	"quanitity" text NOT NULL,
	"storage_history" "storage_history" DEFAULT 'room_temp' NOT NULL,
	"ingredients" text NOT NULL,
	"prepared_date_time" date NOT NULL,
	"elapsedMinutes" integer NOT NULL,
	"maxTimeMinutes" integer NOT NULL,
	"remainingMinutes" integer NOT NULL,
	"expectedExpiryTime" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE cascade ON UPDATE no action;