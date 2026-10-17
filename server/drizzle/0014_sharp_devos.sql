ALTER TABLE "food_category" RENAME COLUMN "id" TO "c_id";--> statement-breakpoint
ALTER TABLE "food_rule" DROP CONSTRAINT "food_rule_c_id_food_category_id_fk";
--> statement-breakpoint
ALTER TABLE "food_rule" ADD CONSTRAINT "food_rule_c_id_food_category_c_id_fk" FOREIGN KEY ("c_id") REFERENCES "public"."food_category"("c_id") ON DELETE cascade ON UPDATE no action;