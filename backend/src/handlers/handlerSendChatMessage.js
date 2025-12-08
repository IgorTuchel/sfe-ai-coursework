import { Chat } from "../models/chatModel.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../middleware/errorMiddleware.js";
import {
  addToContextData,
  getContextData,
} from "../services/contextManager.js";
import { mongoSearchQuery } from "../services/mongoSearchQuery.js";
import { getEmbeddingFromGemini } from "../services/callEmbedingGemini.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { callGemini } from "../services/callGemini.js";
import { getCharacterInformation } from "../services/characterContextManager.js";
import User from "../models/usersModel.js";

export async function handlerSendChatMessage(req, res) {
  const userID = req.user.id;
  const chatID = req.params.chatID;
  const { message } = req.body;

  if (!message) {
    throw new BadRequestError("Message content is required.");
  }

  if (message.length > 2048) {
    throw new BadRequestError(
      "Message exceeds maximum length of 2048 characters."
    );
  }

  const chatDB = await Chat.findById(chatID);
  if (!chatDB) {
    throw new NotFoundError("Chat not found.");
  }

  if (chatDB.userId.toString() !== userID) {
    throw new ForbiddenError("You do not have permission to access this chat.");
  }

  const context = await getContextData(chatID);
  if (!context) {
    throw new BadRequestError("Failed to retrieve chat context.");
  }

  const userMessageEmbedding = await getEmbeddingFromGemini([message]);
  if (!userMessageEmbedding.success) {
    throw new BadRequestError(
      "Error getting embedding for user message: " + userMessageEmbedding.error
    );
  }

  const vectorQueryResponse = await mongoSearchQuery(
    chatDB.characterID,
    message,
    userMessageEmbedding.data[0].embedding
  );
  const userNameDB = await User.findById(userID).select("username");
  const characterInfo = await getCharacterInformation(chatDB.characterID);
  const systemPrompt = characterInfo.systemPrompt
    .replace("{CONVERSATION_CONTEXT}", context.join("\n"))
    .replace(
      "{RETRIVED_RELEVANT_DATA}",
      vectorQueryResponse.map((item) => item.text).join("\n")
    )
    .replace("{USERNAME}", userNameDB.username);
  console.log("System Prompt:", systemPrompt);

  const aiResponse = await callGemini(systemPrompt, message);
  if (!aiResponse.success) {
    throw new BadRequestError("Error from AI service: " + aiResponse.error);
  }

  await Chat.findByIdAndUpdate(
    chatID,
    {
      $push: {
        messages: [
          { role: "user", content: message, timestamp: new Date() },
          { role: "system", content: aiResponse.data, timestamp: new Date() },
        ],
      },
    },
    { new: true }
  );

  addToContextData(chatID, {
    userQuestion: message,
    aiAnswer: aiResponse.data,
  });

  return respondWithJson(res, HTTPCodes.OK, {
    content: aiResponse.data,
    role: "system",
    timestamp: new Date(),
  });
}
