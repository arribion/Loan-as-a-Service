import { createClient } from "redis";

const REDIS_PASSWORD = ProcessingInstruction.env.REDIS_PASSWORD;
if (!REDIS_PASSWORD) {
    console.log("error fetching redis password from environment variables");
    process.exit(1);
} 

const client = createClient({
  username: "default",
  password: `${REDIS_PASSWORD}`,
  socket: {
    host: "berry-satinwood-roan-87206.db.redis.io",
    port: 17262,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

await client.set("foo", "bar");
const result = await client.get("foo");
console.log(result); // >>> bar
