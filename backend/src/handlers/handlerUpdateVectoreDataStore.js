import CharacterVectorStore from "../models/characterVectorDataStore.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { getEmbeddingFromGemini } from "../services/callEmbedingGemini.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerUpdateVectorDataStore(req, res) {
  const dataArray = req.body.dataArray;
  const characterID = req.params.id;
  const dataVectorStoreId = req.params.dataVectorStoreId;

  if (!characterID) {
    throw new BadRequestError("Character ID is required.");
  }
  const character = await CharacterVectorStore.findOne({
    characterID: characterID,
  });
  if (!character) {
    throw new NotFoundError("Character not found for the given characterID.");
  }

  const vectorDataStore = await CharacterVectorStore.findById(
    dataVectorStoreId
  );
  if (!vectorDataStore) {
    throw new NotFoundError("Vector Data Store not found for the given ID.");
  }

  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    throw new BadRequestError("No data provided to update vector data store.");
  }
  if (dataArray.length > 1) {
    throw new BadRequestError("Only one data item can be updated at a time.");
  }

  try {
    const embeddingResponse = await getEmbeddingFromGemini(dataArray);
    if (!embeddingResponse.success) {
      throw new BadRequestError(
        "Error getting embeddings: " + embeddingResponse.error
      );
    }

    await CharacterVectorStore.findByIdAndUpdate(
      dataVectorStoreId,
      {
        embedding: embeddingResponse.data[0].embedding,
        text: embeddingResponse.data[0].text,
      },
      { new: true }
    );

    return respondWithJson(res, HTTPCodes.OK, {
      message: `Vector data store updated successfully for character ${characterID}.`,
    });
  } catch (error) {
    throw new BadRequestError(
      "Error updating vector data store: " + error.message
    );
  }
}
