import geminiClient from "../config/gemini.js";
import redisClient from "../config/redis.js";
import ChatContext from "../models/chatContextModel.js";
import { callGemini } from "./callGemini.js";

export async function getContextData(chatID) {
  let cData = await redisClient.get(`chat_context_${chatID}`);
  const contextData = cData ? JSON.parse(cData) : null;
  if (contextData) {
    return contextData;
  } else {
    const contextData = await ChatContext.findOne({ chatID: chatID });
    if (contextData) {
      await redisClient.setEx(
        `chat_context_${chatID}`,
        300,
        JSON.stringify(contextData.contextData)
      );
      return contextData.contextData;
    } else {
      return null;
    }
  }
}

export async function addToContextData(chatID, newData) {
  let contextData = await getContextData(chatID);
  if (!contextData) {
    return null;
  }
  if (newData.userQuestion === undefined || newData.aiAnswer === undefined) {
    return null;
  }

  const userQuestion = "USER: " + newData.userQuestion;
  const aiAnswer = "SYSTEM: " + newData.aiAnswer;
  contextData.push(userQuestion);
  contextData.push(aiAnswer);

  if (contextData.length > 11) {
    const { success, data, error } = await callGemini(
      `Extract and summarize only the actual conversation messages from the following context. Omit any system information, metadata, or structural information. Focus only on the key substantive points discussed. Provide only factual conversation summary with no preamble.`,
      contextData.join("\n")
    );
    if (success) {
      contextData = ["SYSTEM AI SUMMARY OF PREVIOUS MESSAGES: " + data];
    }
  }
  await ChatContext.findOneAndUpdate(
    { chatID: chatID },
    { contextData: contextData },
    { new: true }
  );
  await redisClient.setEx(
    `chat_context_${chatID}`,
    300,
    JSON.stringify(contextData)
  );
  return contextData;
}
