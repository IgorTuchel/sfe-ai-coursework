/**
 * @file redis.js
 * @description Redis client configuration and initialization.
 * Defines the connection parameters for the Redis store.
 * @module config/redis
 */

import { createClient } from "redis";
import cfg from "./config.js";

/**
 * The configured Redis client instance.
 * @type {ReturnType<typeof createClient>}
 * @description Note: The client is created here but not yet connected.
 * Connection is established in the startup orchestrator.
 * @see https://github.com/redis/node-redis
 */
const redisClient = createClient({
  url: "redis://" + cfg.redisHost + ":" + cfg.redisPort,
});

export default redisClient;
