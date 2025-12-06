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
  const characterID = req.params.id;

  const character = await Character.findById(characterID);
  if (!character) {
    throw new NotFoundError("Character not found for the given characterID.");
  }

  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    throw new BadRequestError("No data provided to create vector data store.");
  }

  try {
    const embeddingRespone = await getEmbeddingFromGemini(dataArray);
    if (!embeddingRespone.success) {
      throw new BadRequestError(
        "Error getting embeddings: " + embeddingRespone.error
      );
    }

    for (const vectorData of embeddingRespone.data) {
      console.log("Vector Data:", vectorData.embedding);
      console.log("Type of Vector Data:", typeof vectorData.embedding);
      let dataStore = {
        characterID: characterID,
        embedding: vectorData.embedding,
        text: vectorData.text,
      };
      await CharacterVectorStore.create(dataStore);
    }
    return respondWithJson(res, HTTPCodes.OK, {
      message: `${embeddingRespone.data.length} Vector data stores created successfully for character ${characterID}.`,
    });
  } catch (error) {
    throw new BadRequestError(
      "Error creating vector data store: " + error.message
    );
  }
}
