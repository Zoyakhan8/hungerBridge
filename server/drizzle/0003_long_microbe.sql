ALTER TABLE "donors" ADD COLUMN "profile_complete" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "dob" text;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "shop_name" text;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "shop_address" text;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "aadhar_url" text;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "shop_license_url" text;