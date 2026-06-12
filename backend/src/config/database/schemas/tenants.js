import { text } from "drizzle-orm/gel-core";
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

export const packageTierEnum = pgEnum("package_tier", [
  "lite",
  "growth",
  "enterprise",
]);

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    password: text("password", { length: 50 }).notNull(),
    email: Text("email").notNull(),
    business_name: varchar("business_name", { length: 200 }),
    package_tier: packageTierEnum("package_tier").notNull(),
    configuration_payload: jsonb("configuration_payload").default({}).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_tenants_tier").on(table.package_tier),
    index("idx_tenants_active").on(table.is_active),
  ],
);

export default tenants;