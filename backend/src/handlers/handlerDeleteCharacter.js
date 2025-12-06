import Character from "../models/characterModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { NotFoundError } from "../middleware/errorMiddleware.js";

export async function handlerDeleteCharacter(req, res) {
  const characterID = req.params.id;

  const deletedCharacter = await Character.findByIdAndDelete(characterID);
  if (!deletedCharacter) {
    throw new NotFoundError("Character not found.");
  }
  return respondWithJson(res, HTTPCodes.OK, {
    message: "Character deleted successfully.",
  });
}
