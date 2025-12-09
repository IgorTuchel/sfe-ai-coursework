/**
 * @file redis.js
 * @description Redis client configuration and initialization.
 * Defines the connection parameters for the Redis store.
 * @module config/redis
 */

import { createClient } from "redis";

/**
 * The configured Redis client instance.
 * @type {ReturnType<typeof createClient>}
 * @description Note: The client is created here but not yet connected.
 * Connection is established in the startup orchestrator.
 * @see https://github.com/redis/node-redis
 */
const redisClient = createClient({
  url: "redis://localhost:6379",
});

export default redisClient;
