import {
  pgTable,
  uuid,
  text,
  smallint,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core"; 
import { sql } from "drizzle-orm";
import { users } from "./users";

export const customer_profiles = pgTable(
  "customer_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    user_id: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    national_identity_number: text("national_identity_number").notNull(),
    phone_number: text("phone_number").notNull(),
    encryption_key_vector: text("encryption_key_vector").notNull(),

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

export default customer_profiles;
