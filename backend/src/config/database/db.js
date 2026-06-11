import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.log("database config url not found");
    process.exit(1);
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);