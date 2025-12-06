import redisClient from "../config/redis.js";
import Character from "../models/characterModel.js";

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
