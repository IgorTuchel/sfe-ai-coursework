/**
 * @file handlerDeleteVectorDataStore.js
 * @description Handler for deleting a vector data store by ID.
 * Validates existence and removes it from the database.
 * @module handlers/handlerDeleteVectorDataStore
 */

import CharacterVectorStore from "../models/characterVectorDataStore.js";
import { NotFoundError } from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerDeleteVectorDataStore(req, res) {
  const dataVectorStoreId = req.params.dataVectorStoreId;

  const deletedVectorDataStore = await CharacterVectorStore.findByIdAndDelete(
    dataVectorStoreId
  );

  if (!deletedVectorDataStore) {
    throw new NotFoundError("Vector Data Store not found.");
  }

  return respondWithJson(res, HTTPCodes.OK, {
    message: "Vector Data Store deleted successfully.",
  });
}
