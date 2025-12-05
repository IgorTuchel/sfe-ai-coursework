import CharacterVectorStore from "../models/characterVectorDataStore.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerDeleteVectorDataStore(req, res) {
  const dataVectorStoreId = req.params.dataVectorStoreId;

  try {
    const deletedVectorDataStore = await CharacterVectorStore.findByIdAndDelete(
      dataVectorStoreId
    );

    if (!deletedVectorDataStore) {
      throw new NotFoundError("Vector Data Store not found.");
    }

    return respondWithJson(res, HTTPCodes.OK, {
      message: "Vector Data Store deleted successfully.",
    });
  } catch (error) {
    throw new BadRequestError(
      "Error deleting vector data store: " + error.message
    );
  }
}
