import { createClient } from "redis";

const REDIS_PASSWORD = ProcessingInstruction.env.REDIS_PASSWORD;
if (!REDIS_PASSWORD) {
    console.log("error fetching redis password from environment variables");
    process.exit(1);
} 

const redis_client = createClient({
  username: "default",
  password: `${REDIS_PASSWORD}`,
  socket: {
    host: "berry-satinwood-roan-87206.db.redis.io",
    port: 17262,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));
const init_redis = async () => {
  try {
    await redis_client.connect().then(() => {
      console.log("redis connected successfully...")
    });
    await redis_client.set("foo", "bar");
    const result = await redis_client.get("foo");
  } catch (error) {
    console.log("Redis: ", error);
  }
}

console.log(result)
