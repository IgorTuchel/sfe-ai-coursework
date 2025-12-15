/**
 * @file handlerCreateChat.js
 * @description Handler for creating a new chat based on a specified character.
 * Validates character access permissions, initializes chat with a system message,
 * and stores chat context in Redis for quick retrieval.
 * @module handlers/handlerCreateChat
 */

import Character from "../models/characterModel.js";
import Chat from "../models/chatModel.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import redisClient from "../config/redis.js";
import Users from "../models/usersModel.js";
import ChatContext from "../models/chatContextModel.js";

export async function handlerCreateChat(req, res) {
  const userID = req.user.id;
  const { characterID } = req.body;

  if (!characterID) {
    throw new BadRequestError("Character ID is required to create a chat.");
  }

  const characterDB = await Character.findById(characterID);
  if (!characterDB) {
    throw new NotFoundError("Character not found.");
  }

  if (!characterDB.isPublic) {
    const dbUser = await Users.findById(userID);
    if (dbUser.role !== "admin") {
      throw new ForbiddenError(
        "You do not have permission to use this character.",
        "INSUFFICIENT_PERMISSIONS"
      );
    }
  }

  const firstMessage =
    characterDB.firstMessage || "Hello! How can I assist you today?";
  const newChat = {
    characterID: characterID,
    userId: userID,
    messages: [
      {
        role: "system",
        content: firstMessage,
        timestamp: new Date(),
      },
    ],
    chatName: "Chat with " + characterDB.name,
    bookmarked: false,
  };

  const createdChat = await Chat.create(newChat);

  const newChatContext = {
    chatID: createdChat._id,
    contextData: ["SYSTEM: " + characterDB.firstMessage || ""],
  };

  await ChatContext.create(newChatContext);

  await redisClient.setEx(
    `chat_context_${createdChat._id}`,
    300,
    JSON.stringify(newChatContext.contextData)
  );

  return respondWithJson(res, HTTPCodes.CREATED, {
    chat: {
      id: createdChat._id,
      character: {
        id: characterDB._id,
        name: characterDB.name,
        avatarUrl: characterDB.avatarUrl,
        description: characterDB.description,
      },
      messages: createdChat.messages,
      bookmarked: createdChat.bookmarked,
      chatName: createdChat.chatName,
      updatedAt: createdChat.updatedAt,
    },
  });
}
