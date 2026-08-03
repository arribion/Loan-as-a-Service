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
import {tenants} from "./tenants.js";

export const interestCalculationTypeEnum = pgEnum("interest_calculation_type", [
  "flat",
  "reducing_balance",
  "compound",
]);

export const loanProducts = pgTable(
  "loan_products",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }), // cascade deletes products when tenant is removed (optional)
    referenceTitle: varchar("reference_title", { length: 120 }).notNull(),
    interestCalculationType: interestCalculationTypeEnum(
      "interest_calculation_type",
    )
      .notNull()
      .default("flat"),
    basePercentage: numeric("base_percentage", { precision: 6, scale: 4 })
      .notNull()
      .default("1.0000"), // changed default to pass check
    fineRules: jsonb("fine_rules").default("{}").notNull(),
    minLoanAmount: numeric("min_loan_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    maxLoanAmount: numeric("max_loan_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    minTermDays: integer("min_term_days").notNull(), // changed from max_term_days
  },
  (table) => [
    index("idx_lp_tenant").on(table.tenant_id),
    check("base_percentage_check", sql`${table.basePercentage} > 0`),
  ],
);