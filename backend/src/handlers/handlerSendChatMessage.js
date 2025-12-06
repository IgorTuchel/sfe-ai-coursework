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

export async function handlerSendChatMessage(req, res) {
  const userID = req.user.id;
  const chatID = req.params.chatID;
  const { message } = req.body;

  if (!message) {
    throw new BadRequestError("Message content is required.");
  }

  if (message.length > 512) {
    throw new BadRequestError(
      "Message exceeds maximum length of 512 characters."
    );
  }

  try {
    const chatDB = await Chat.findById(chatID);
    console.log("Hit Checkpoint 1");
    if (!chatDB) {
      throw new NotFoundError("Chat not found.");
    }
    if (chatDB.userId.toString() !== userID) {
      throw new ForbiddenError(
        "You do not have permission to access this chat."
      );
    }
    console.log("Hit Checkpoint 2");
    const context = await getContextData(chatID);
    if (!context) {
      throw new BadRequestError("Failed to retrieve chat context.");
    }
    console.log("Hit Checkpoint 3");
    const userMessageEmbedding = await getEmbeddingFromGemini([message]);
    if (!userMessageEmbedding.success) {
      throw new BadRequestError(
        "Error getting embedding for user message: " +
          userMessageEmbedding.error
      );
    }
    console.log("Hit Checkpoint 4");
    const vectorQueryResponse = await mongoSearchQuery(
      chatDB.characterID,
      message,
      userMessageEmbedding.data[0].embedding
    );
    console.log("Vector Query Response:", vectorQueryResponse);
    console.log("Hit Checkpoint 5");
    const characterInfo = await getCharacterInformation(chatDB.characterID);
    console.log(characterInfo.systemPrompt);
    const systemPrompt = characterInfo.systemPrompt
      .replace("{CONVERSATION_CONTEXT}", context.join("\n"))
      .replace(
        "{RETRIVED_RELEVANT_DATA}",
        vectorQueryResponse.map((item) => item.text).join("\n")
      );
    console.log(systemPrompt);
    console.log("Hit Checkpoint 6");
    const aiResponse = await callGemini(systemPrompt, message);
    if (!aiResponse.success) {
      throw new BadRequestError("Error from AI service: " + aiResponse.error);
    }
    console.log("Hit Checkpoint 7");
    const updatedChat = await Chat.findByIdAndUpdate(
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
    console.log("Hit Checkpoint 8");
    await addToContextData(chatID, {
      userQuestion: message,
      aiAnswer: aiResponse.data,
    });
    console.log("Hit Checkpoint 9");
    return respondWithJson(res, HTTPCodes.OK, {
      aiResponse: aiResponse.data,
    });
  } catch (error) {
    console.log("Error in handlerSendChatMessage:", error);
    throw new BadRequestError("Failed to send chat message...");
  }
}
