CREATE TABLE "iot_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"box_id" integer NOT NULL,
	"reading_id" integer,
	"alert_type" text NOT NULL,
	"severity" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp with time zone,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "iot_boxes" (
	"id" serial PRIMARY KEY NOT NULL,
	"box_code" text NOT NULL,
	"device_secret_hash" text NOT NULL,
	"donation_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "iot_boxes_box_code_unique" UNIQUE("box_code"),
	CONSTRAINT "iot_boxes_device_secret_hash_unique" UNIQUE("device_secret_hash")
);
--> statement-breakpoint
CREATE TABLE "iot_readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"box_id" integer NOT NULL,
	"temperature" double precision,
	"humidity" double precision,
	"door_open" boolean,
	"door_open_count" integer,
	"battery_percent" integer,
	"recorded_at" timestamp with time zone NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "iot_alerts" ADD CONSTRAINT "iot_alerts_box_id_iot_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."iot_boxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iot_alerts" ADD CONSTRAINT "iot_alerts_reading_id_iot_readings_id_fk" FOREIGN KEY ("reading_id") REFERENCES "public"."iot_readings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iot_boxes" ADD CONSTRAINT "iot_boxes_donation_id_donations_donation_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("donation_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iot_readings" ADD CONSTRAINT "iot_readings_box_id_iot_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."iot_boxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "iot_alerts_box_status_idx" ON "iot_alerts" USING btree ("box_id","status");--> statement-breakpoint
CREATE INDEX "iot_alerts_created_at_idx" ON "iot_alerts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "iot_boxes_donation_id_idx" ON "iot_boxes" USING btree ("donation_id");--> statement-breakpoint
CREATE INDEX "iot_boxes_last_seen_at_idx" ON "iot_boxes" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "iot_readings_box_recorded_idx" ON "iot_readings" USING btree ("box_id","recorded_at");