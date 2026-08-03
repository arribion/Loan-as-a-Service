import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  jsonb,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const packageTierEnum = pgEnum("package_tier", [
  "lite",
  "growth",
  "enterprise",
]);

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    businessName: varchar("business_name", { length: 200 }).notNull(),
    packageTier: packageTierEnum("package_tier").notNull().default("lite"),
    configurationPayload: jsonb("configuration_payload")
      .default("{}")
      .notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_tenants_tier").on(table.packageTier),
    index("idx_tenants_active").on(table.isActive),
  ],
);