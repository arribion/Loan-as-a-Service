import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  numeric,
  integer,
  jsonb,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import tenants from "./tenants.js";

export const interestCalculationTypeEnum = pgEnum("interest_calculation_type", [
  "flat",
  "reducing_balance",
  "compound",
]);

export const loan_products = pgTable(
  "loan_products",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }), // cascade deletes products when tenant is removed (optional)
    reference_title: varchar("reference_title", { length: 120 }).notNull(),
    interest_calculation_type: interestCalculationTypeEnum(
      "interest_calculation_type",
    )
      .notNull()
      .default("flat"),
    base_percentage: numeric("base_percentage", { precision: 6, scale: 4 })
      .notNull()
      .default("1.0000"), // changed default to pass check
    fine_rules: jsonb("fine_rules")
      .default(sql`"{}"::jsonb`)
      .notNull(),
    min_loan_amount: numeric("min_loan_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    max_loan_amount: numeric("max_loan_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    min_term_days: integer("min_term_days").notNull(), // changed from max_term_days
  },
  (table) => [
    index("idx_lp_tenant").on(table.tenant_id),
    check("base_percentage_check", sql`${table.base_percentage} > 0`),
  ],
);

export default loan_products;
