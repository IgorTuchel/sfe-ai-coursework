import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import Character from "../models/characterModel.js";
import CharacterVectorStore from "../models/characterVectorDataStore.js";
import { getEmbeddingFromGemini } from "../services/callEmbedingGemini.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerCreateVectorDataStore(req, res) {
  const dataArray = req.body.dataArray;
  const characterID = req.params.characterID;

  const character = await Character.findById(characterID);
  if (!character) {
    throw new NotFoundError("Character not found for the given characterID.");
  }

  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    throw new BadRequestError("No data provided to create vector data store.");
  }

  const embeddingRespone = await getEmbeddingFromGemini(dataArray);
  if (!embeddingRespone.success) {
    throw new BadRequestError(
      "Error getting embeddings: " + embeddingRespone.error
    );
  }
  let createdObjects = [];
  for (const vectorData of embeddingRespone.data) {
    let dataStore = {
      characterID: characterID,
      embedding: vectorData.embedding,
      text: vectorData.text,
    };
    const createdObject = await CharacterVectorStore.create(dataStore);
    createdObjects.push({
      _id: createdObject._id,
      characterID: createdObject.characterID,
      text: createdObject.text,
    });
  }

  return respondWithJson(res, HTTPCodes.OK, {
    message: `${embeddingRespone.data.length} Vector data stores created successfully for character ${characterID}.`,
    data: createdObjects,
  });
}
