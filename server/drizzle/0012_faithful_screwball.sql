CREATE TYPE "public"."condition" AS ENUM('room_temp', 'refrigerator', 'freezer');--> statement-breakpoint
CREATE TYPE "public"."risk_condition" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TABLE "foodCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"c_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodRule" (
	"rule_id" serial PRIMARY KEY NOT NULL,
	"c_id" integer NOT NULL,
	"storage_condition" "condition" DEFAULT 'room_temp' NOT NULL,
	"min_temp" real NOT NULL,
	"max_temp" real NOT NULL,
	"max_time" integer NOT NULL,
	"risk" "risk_condition" DEFAULT 'high' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "foodRule" ADD CONSTRAINT "foodRule_c_id_foodCategory_id_fk" FOREIGN KEY ("c_id") REFERENCES "public"."foodCategory"("id") ON DELETE cascade ON UPDATE no action;