import { getCharacterInformation } from "../services/characterContextManager.js";
import Chat from "../models/chatModel.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerGetChat(req, res) {
  const chatID = req.params.chatID;
  const userID = req.user.id;

  const chatDB = await Chat.findById(chatID);
  if (!chatDB) {
    throw new NotFoundError("Chat not found.");
  }
  if (userID !== chatDB.userId.toString()) {
    throw new BadRequestError(
      "You do not have permission to access this chat."
    );
  }

  return respondWithJson(res, HTTPCodes.OK, {
    chat: chatDB,
  });
}

export async function handlerGetAllChats(req, res) {
  const userID = req.user.id;

  let chatsDB = await Chat.find({ userId: userID })
    .sort({ updatedAt: -1 })
    .select("characterID chatName updatedAt bookmarked")
    .lean();

  if (!chatsDB) {
    throw new NotFoundError("No chats found for this user.");
  }

  await Promise.all(
    chatsDB.map(async (chat) => {
      const characterDB = await getCharacterInformation(chat.characterID);
      chat.character = {
        name: characterDB.name,
        avatarUrl: characterDB.avatarUrl,
      };
    })
  );

  return respondWithJson(res, HTTPCodes.OK, {
    chats: chatsDB,
  });
}
