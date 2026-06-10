import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  numeric,
  integer,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { users } from "./users";
import { loanProducts } from "./loan_products";

export const loanStatusEnum = pgEnum("loan_status", [
  "pending_approval",
  "active",
  "fully_repaid",
  "defaulted",
  "written_off",
]);

export const loans = pgTable(
  "loans",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id),
    borrower_id: uuid("borrower_id")
      .notNull()
      .references(() => users.id), // References user (borrower seat)
    product_id: uuid("product_id")
      .notNull()
      .references(() => loanProducts.id),
    principal_amount: numeric("principal_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    balance_outstanding: numeric("balance_outstanding", {
      precision: 15,
      scale: 2,
    }).notNull(),
    status: loanStatusEnum("status").default("pending_approval").notNull(),
    term_days: integer("term_days").notNull(),
    disbursed_at: timestamp("disbursed_at", {
      withTimezone: true,
      mode: "string",
    }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_loans_tenant").on(table.tenant_id),
    index("idx_loans_borrower").on(table.borrower_id),
    index("idx_loans_status").on(table.status),
    check("principal_check", sql`${table.principal_amount} > 0`),
    check("balance_check", sql`${table.balance_outstanding} >= 0`),
  ],
);
