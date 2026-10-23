CREATE TABLE "iot_box_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"box_id" integer NOT NULL,
	"donation_id" integer NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"returned_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "iot_readings" ADD COLUMN "donation_id" integer;--> statement-breakpoint
ALTER TABLE "iot_box_assignments" ADD CONSTRAINT "iot_box_assignments_box_id_iot_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."iot_boxes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iot_box_assignments" ADD CONSTRAINT "iot_box_assignments_donation_id_donations_donation_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("donation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "iot_box_assignments_donation_idx" ON "iot_box_assignments" USING btree ("donation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "iot_box_one_active_assignment_idx" ON "iot_box_assignments" USING btree ("box_id") WHERE "iot_box_assignments"."returned_at" IS NULL;--> statement-breakpoint
ALTER TABLE "iot_readings" ADD CONSTRAINT "iot_readings_donation_id_donations_donation_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("donation_id") ON DELETE set null ON UPDATE no action;