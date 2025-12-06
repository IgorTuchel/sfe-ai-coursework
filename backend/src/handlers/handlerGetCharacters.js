import { BadRequestError } from "../middleware/errorMiddleware.js";
import Character from "../models/characterModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerGetCharacters(req, res) {
  const characters = await Character.find({
    isPublic: true,
  });

  return respondWithJson(res, HTTPCodes.OK, {
    characters: [
      {
        characters: characters.map((char) => ({
          id: char._id,
          name: char.name,
          description: char.description,
        })),
      },
    ],
  });
}

export async function handlerGetAllCharacters(req, res) {
  const characters = await Character.find({});
  return respondWithJson(res, HTTPCodes.OK, { characters: characters });
}
