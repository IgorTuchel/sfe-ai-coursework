import Chat from "../models/chatModel.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerDeleteChat(req, res) {
  const chatID = req.params.chatID;

  try {
    const chatDB = await Chat.findById(chatID);
    if (!chatDB) {
      throw new NotFoundError("Chat not found.");
    }
    if (req.user.id !== chatDB.userId.toString()) {
      throw new BadRequestError(
        "You do not have permission to delete this chat."
      );
    }
    await Chat.findByIdAndDelete(chatID);
    return respondWithJson(res, HTTPCodes.OK, {
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    throw new BadRequestError("Failed to delete chat");
  }
}
