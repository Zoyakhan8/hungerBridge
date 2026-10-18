CREATE TYPE "public"."complaint_status" AS ENUM('pending', 'in_progress', 'resolved', 'rejected');--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"category" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "complaint_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "complaints_public_id_unique" UNIQUE("public_id")
);
