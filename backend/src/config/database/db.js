import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.log("database config url not found");
    process.exit(1);
}

const sql = neon(DATABASE_URL, {
  fetchOptions: {
    timeout: 30000, // 30 seconds
  },
});

export const db = drizzle(sql);

// Database Connection test function
async function checkConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Neon DB connected successfully...');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); 
  }
}
checkConnection();