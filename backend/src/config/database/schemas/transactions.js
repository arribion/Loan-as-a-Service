import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import tenants from "./tenants.js";
import loans from "./loans.js";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "disbursement",
  "repayment",
  "penalty",
  "reversal",
]);
export const ledgerDirectionEnum = pgEnum("ledger_direction", [
  "debit",
  "credit",
]);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    loan_id: uuid("loan_id")
      .notNull()
      .references(() => loans.id, { onDelete: "restrict" }), // prevent deleting a loan with transactions
    external_receipt_reference: varchar("external_receipt_reference", {
      length: 100,
    }).unique(),
    ledger_direction: ledgerDirectionEnum("ledger_direction").notNull(),
    transaction_type: transactionTypeEnum("transaction_type").notNull(),
    raw_amount: numeric("raw_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    penalty_portion: numeric("penalty_portion", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    interest_portion: numeric("interest_portion", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    principal_portion: numeric("principal_portion", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    log_timestamp: timestamp("log_timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_txn_tenant").on(table.tenant_id),
    index("idx_txn_loan").on(table.loan_id),
    index("idx_txn_ref").on(table.external_receipt_reference),
    index("idx_txn_time").on(table.log_timestamp),
  ],
);

export default transactions;