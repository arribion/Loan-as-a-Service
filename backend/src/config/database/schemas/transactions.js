import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import {tenants} from "./tenants.js";
import {loans} from "./loans.js";

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
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    loanId: uuid("loan_id")
      .notNull()
      .references(() => loans.id, { onDelete: "restrict" }), // prevent deleting a loan with transactions
    externalReceiptReference: varchar("external_receipt_reference", {
      length: 100,
    }).unique(),
    ledgerDirection: ledgerDirectionEnum("ledger_direction").notNull(),
    transactionType: transactionTypeEnum("transaction_type").notNull(),
    rawAmount: numeric("raw_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    penaltyPortion: numeric("penalty_portion", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    interestPortion: numeric("interest_portion", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    principalPortion: numeric("principal_portion", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    logTimestamp: timestamp("log_timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_txn_tenant").on(table.tenantId),
    index("idx_txn_loan").on(table.loanId),
    index("idx_txn_ref").on(table.externalReceiptReference),
    index("idx_txn_time").on(table.logTimestamp),
  ],
);