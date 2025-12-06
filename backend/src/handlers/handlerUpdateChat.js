import Chat from "../models/chatModel.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerUpdateChat(req, res) {
  const chatID = req.params.chatID;
  const { newChatName, isBookmarked } = req.body;

  if (!newChatName || typeof isBookmarked !== "boolean") {
    throw new BadRequestError("Invalid input.");
  }

  if (newChatName.length > 100) {
    throw new BadRequestError("Chat name is too long.");
  }

  try {
    const chatDB = await Chat.findById(chatID);
    if (!chatDB) {
      throw new NotFoundError("Chat not found.");
    }
    if (req.user.id !== chatDB.userId.toString()) {
      throw new BadRequestError(
        "You do not have permission to update this chat."
      );
    }

    if (chatDB.bookmarked === isBookmarked && chatDB.chatName === newChatName) {
      return respondWithJson(res, HTTPCodes.OK, {
        message: "No changes detected.",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatID,
      {
        chatName: newChatName,
        bookmarked: isBookmarked,
      },
      { new: true }
    );

    if (!updatedChat) {
      throw new NotFoundError("Chat not found.");
    }

    return respondWithJson(res, HTTPCodes.OK, {
      chatID: updatedChat._id,
      name: updatedChat.chatName,
      isBookmarked: updatedChat.bookmarked,
      updatedAt: updatedChat.updatedAt,
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}
