import {
  pgTable,
  uuid,
  customType,
  smallint,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

const bytea =
  customType <
  { data: Buffer } >
  {
    dataType: () => "bytea",
  };

export const customerProfiles = pgTable(
  "customer_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    user_id: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    national_identity_number: bytea("national_identity_number").notNull(), // AES-256 encrypted string stored as binary
    phone_number: bytea("phone_number").notNull(), // AES-256 encrypted string stored as binary
    encryption_key_vector: bytea("encryption_key_vector").notNull(), // AES-256 encrypted string stored as binary
    credit_score: smallint("credit_score"),
    date_of_birth: timestamp("date_of_birth", { mode: "string" }),
    kyc_verified_at: timestamp("kyc_verified_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => [
    index("idx_cust_user").on(table.user_id),
    check("credit_score_check", sql`${table.credit_score} BETWEEN 0 AND 1000`),
  ],
);
