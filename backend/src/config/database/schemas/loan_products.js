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
import { tenants } from "./tenants";

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
      .references(() => tenants.id),
    reference_title: varchar("reference_title", { length: 120 }).notNull(),
    interest_calculation_type: interestCalculationTypeEnum(
      "interest_calculation_type",
    ).notNull(),
    base_percentage: numeric("base_percentage", {
      precision: 6,
      scale: 4,
    }).notNull(),
    fine_rules: jsonb("fine_rules").default({}).notNull(),
    min_loan_amount: numeric("min_loan_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    max_loan_amount: numeric("max_loan_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    max_term_days: integer("max_term_days").notNull(),
  },
  (table) => [
    index("idx_lp_tenant").on(table.tenant_id),
    check("base_percentage_check", sql`${table.base_percentage} > 0`),
  ],
);

export default loan_products