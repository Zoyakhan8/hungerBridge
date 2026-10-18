ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_qr_token_unique";--> statement-breakpoint
ALTER TABLE "delivery_partners" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "delivery_partners" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "pickup_qr_token" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "handover_qr_token" text;--> statement-breakpoint
ALTER TABLE "deliveries" DROP COLUMN "qr_token";--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_pickup_qr_token_unique" UNIQUE("pickup_qr_token");--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_handover_qr_token_unique" UNIQUE("handover_qr_token");