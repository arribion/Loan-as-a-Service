// staff drizzle schema
// Name *
// Email *
// Password *
// User Type *
// Select One
//
//  Admin will get full access and user will get role based access only.
// User Role
// Branch

// Main Branch
//   If not assign any branch then user will get default branch access.
// Status *

import { PgTable, varchar, text, } from "drizzle-orm/pg-core";

export const staff = PgTable("staff", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    security_role: securityRoleEnum("security_role").notNull().default("borrower"),
    password: text("password").notNull(),
    user_type: varchar("user_type", { length: 50 }).notNull(),
    branch: varchar("branch", { length: 100 }),
    status: varchar("status", { length: 20 }).notNull(),
});