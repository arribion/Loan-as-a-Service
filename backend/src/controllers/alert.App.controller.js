import db from "../config/database/db.js";
import { sql } from "drizzle-orm";

export default async function alertApp(req, res) {
    try {
        // Execute raw SQL to get the current timestamp from PostgreSQL
        const result = await db.execute(sql`SELECT NOW()`);

        // Extract the timestamp string from the database response
        const currentTime = result.rows[0].now;

        // Return the required response
        return res.status(200).json({
            status: "success",
            message: "App is up",
            time: currentTime
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}
