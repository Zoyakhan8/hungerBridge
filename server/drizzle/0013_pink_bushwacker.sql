ALTER TABLE "foodCategory" RENAME TO "food_category";--> statement-breakpoint
ALTER TABLE "foodRule" RENAME TO "food_rule";--> statement-breakpoint
ALTER TABLE "food_rule" DROP CONSTRAINT "foodRule_c_id_foodCategory_id_fk";
--> statement-breakpoint
ALTER TABLE "food_rule" ADD CONSTRAINT "food_rule_c_id_food_category_id_fk" FOREIGN KEY ("c_id") REFERENCES "public"."food_category"("id") ON DELETE cascade ON UPDATE no action;