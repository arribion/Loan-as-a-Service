// src/config/database/db.js
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log("database config url not found");
  process.exit(1);
}

// Create the postgres connection
const queryClient = postgres(DATABASE_URL, {
  idle_timeout: 30,
  max_lifetime: 60 * 60,
  connect_timeout: 30,
});

export const db = drizzle(queryClient);

// Database Connection test function
async function checkConnection() {
  try {
    await queryClient`SELECT 1`;
    console.log("Neon DB connected successfully...");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

checkConnection();