// seed.js
import db from "./src/config/database/db.js";
import { tenants } from "./src/config/database/schemas/tenants.js";
import { users } from "./src/config/database/schemas/users.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("🌱 Seeding demo tenant...");

    // 1. Check if tenant already exists using Drizzle query builder
    const existingTenants = await db
      .select()
      .from(tenants)
      .where(eq(tenants.business_name, "Baraka Chama"))
      .limit(1);

    if (existingTenants.length > 0) {
      console.log("⚠️ Demo tenant already exists. Skipping seed.");
      process.exit(0);
    }

    // 2. Create the tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        business_name: "Baraka Chama",
        package_tier: "lite",
        configuration_payload: {},
        is_active: true,
      })
      .returning();

    console.log("✅ Tenant created:", tenant.id);

    // 3. Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10);
    const memberPassword = await bcrypt.hash("member123", 10);

    // 4. Insert users
    const [adminUser, memberUser] = await db
      .insert(users)
      .values([
        {
          tenant_id: tenant.id,
          full_name: "Demo Admin",
          email_address: "admin@barakachama.co.ke",
          password_hash: adminPassword,
          phone_number: "0712345678",
          security_role: "admin",
          tracking_status: "active",
        },
        {
          tenant_id: tenant.id,
          full_name: "Demo Member",
          email_address: "member@barakachama.co.ke",
          password_hash: memberPassword,
          phone_number: "0722334455",
          security_role: "borrower",
          tracking_status: "active",
        },
      ])
      .returning();

    console.log("✅ Users created:");
    console.log(`  - Admin: admin@barakachama.co.ke / admin123`);
    console.log(`  - Member: member@barakachama.co.ke / member123`);

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();