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
import { users } from "./users.js";

export const customerProfiles = pgTable(
  "customer_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    nationalIdentityNumber: text("national_identity_number")
      .notNull()
      .unique(), // no default
    phoneNumber: text("phone_number").notNull(),
    encryptionKeyVector: text("encryption_key_vector").notNull(),
    creditScore: smallint("credit_score").default(0),
    dateOfBirth: timestamp("date_of_birth", { mode: "string" }),
    kycVerifiedAt: timestamp("kyc_verified_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => [
    index("idx_cust_user").on(table.user_id),
    check("credit_score_check", sql`${table.creditScore} BETWEEN 0 AND 1000`),
  ],
);
