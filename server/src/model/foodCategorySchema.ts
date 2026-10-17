import { integer, pgEnum, pgTable, real, serial, text } from "drizzle-orm/pg-core";

export const foodCategory=pgTable("food_category",{
    c_id: serial("c_id").primaryKey(),
    c_name:text("c_name").notNull()
})

export const condition = pgEnum("condition", [
  "room_temp",
  "refrigerator",
  "freezer",
]);
export const riskCondition = pgEnum("risk_condition", [
  "high",
  "medium",
  "low",
]);
export const foodRule=pgTable("food_rule",{
    rule_id:serial("rule_id").primaryKey(),
    c_id: integer("c_id").references(() => foodCategory.c_id,
        { onDelete: "cascade", }).notNull(),
    storage_condition:condition("storage_condition").default("room_temp").notNull(),
    min_temp:real("min_temp").notNull(),
    max_temp:real("max_temp").notNull(),
    max_time:integer("max_time").notNull(),
    risk:riskCondition("risk").notNull().default("high")
})