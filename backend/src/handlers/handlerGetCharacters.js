import { BadRequestError } from "../middleware/errorMiddleware.js";
import Character from "../models/characterModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerGetCharacter(req, res) {
  const characterID = req.params.characterID;

  const character = await Character.findById(characterID);
  if (!character) {
    throw new BadRequestError("Character not found.");
  }

  return respondWithJson(res, HTTPCodes.OK, {
    character: {
      id: character._id,
      name: character.name,
      description: character.description,
      avatarUrl: character.avatarUrl,
      theme: character.theme,
    },
  });
}

export async function handlerGetCharacters(req, res) {
  const characters = await Character.find({
    isPublic: true,
  });

  return respondWithJson(res, HTTPCodes.OK, {
    characters: characters.map((char) => ({
      id: char._id,
      name: char.name,
      description: char.description,
      avatarUrl: char.avatarUrl,
    })),
  });
}

export async function handlerGetAllCharacters(req, res) {
  const characters = await Character.find({}).select("-theme -jsonScript");
  return respondWithJson(res, HTTPCodes.OK, {
    characters: characters.map((char) => ({
      id: char._id,
      name: char.name,
      description: char.description,
      avatarUrl: char.avatarUrl,
      isPublic: char.isPublic,
    })),
  });
}

export async function handlerGetAllCharacterByID(req, res) {
  const characterID = req.params.characterID;

  const character = await Character.findById(characterID).select();
  if (!character) {
    throw new BadRequestError("Character not found.");
  }

  return respondWithJson(res, HTTPCodes.OK, { character: character });
}
