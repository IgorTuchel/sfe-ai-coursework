import CharacterVectorStore from "../models/characterVectorDataStore.js";
import { NotFoundError } from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerGetVectorDataStore(req, res) {
  const characterID = req.params.characterID;

  const characterVectorStore = await CharacterVectorStore.find({
    characterID: characterID,
  }).select("-embedding");
  if (!characterVectorStore) {
    throw new NotFoundError(
      "No vector data store found for the given character ID."
    );
  }

  return respondWithJson(res, HTTPCodes.OK, {
    message: `Vector data store retrieved successfully for character ${characterID}.`,
    data: characterVectorStore,
  });
}
