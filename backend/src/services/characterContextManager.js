/**
 * @file characterCache.js
 * @description Service for caching and retrieving character information using Redis.
 * Provides functionality to fetch character data with automatic caching and cache invalidation
 * to optimize database queries.
 * @module services/characterContextManager
 */

import redisClient from "../config/redis.js";
import Character from "../models/characterModel.js";

/**
 * Retrieves character information from cache or database.
 *
 * @async
 * @param {string} characterID - The unique identifier of the character to retrieve.
 * @returns {Promise<Object|null>} Character object if found, null otherwise.
 *
 * @description Attempts to retrieve character data from Redis cache first.
 * If not cached, fetches from MongoDB and caches the result for 1 hour (3600 seconds).
 * Returns null if character is not found in either cache or database.
 *
 * @example
 * const character = await getCharacterInformation("507f1f77bcf86cd799439011");
 * if (character) {
 *   console.log(character.name);
 * } else {
 *   console.log("Character not found");
 * }
 */
export async function getCharacterInformation(characterID) {
  const character = await redisClient.get(`character_info_${characterID}`);
  if (character) {
    return JSON.parse(character);
  }

  const characterDB = await Character.findById(characterID);
  if (characterDB) {
    await redisClient.setEx(
      `character_info_${characterID}`,
      3600,
      JSON.stringify(characterDB)
    );
    return characterDB;
  }

  return null;
}

/**
 * Invalidates the cached character information for a specific character.
 *
 * @async
 * @param {string} characterID - The unique identifier of the character whose cache should be invalidated.
 * @returns {Promise<void>}
 *
 * @description Removes character data from Redis cache. Use this when character information
 * is updated or deleted to ensure subsequent requests fetch fresh data from the database.
 *
 * @example
 * await invalidateCharacterCache("507f1f77bcf86cd799439011");
 * // Next call to getCharacterInformation will fetch from database
 */
export async function invalidateCharacterCache(characterID) {
  await redisClient.del(`character_info_${characterID}`);
}
