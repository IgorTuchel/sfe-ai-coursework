import { createClient } from "redis";

const redisClient = await createClient({
  url: "redis://localhost:6379",
});

export default redisClient;
