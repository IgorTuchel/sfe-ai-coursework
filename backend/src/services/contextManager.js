/**
 * @file contextManager.js
 * @description Service for managing chat conversation context using Redis and MongoDB.
 * Provides functionality to retrieve and update chat context with automatic summarization
 * when conversations exceed length limits.
 * @module services/contextManager
 */

import redisClient from "../config/redis.js";
import ChatContext from "../models/chatContextModel.js";
import { callGemini } from "./callGemini.js";

/**
 * Retrieves chat context data from cache or database.
 *
 * @async
 * @param {string} chatID - The unique identifier of the chat conversation.
 * @returns {Promise<Array<string>|null>} Array of context messages if found, null otherwise.
 *
 * @description Attempts to retrieve chat context from Redis cache first.
 * If not cached, fetches from MongoDB and caches the result for 5 minutes (300 seconds).
 * Returns null if chat context is not found in either cache or database.
 *
 * @example
 * const context = await getContextData("chat_12345");
 * if (context) {
 *   console.log(context); // ["USER: Hello", "SYSTEM: Hi there!", ...]
 * }
 */
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

/**
 * Adds a new user question and AI answer to the chat context.
 *
 * @async
 * @param {string} chatID - The unique identifier of the chat conversation.
 * @param {Object} newData - Object containing the new conversation turn.
 * @param {string} newData.userQuestion - The user's question or message.
 * @param {string} newData.aiAnswer - The AI's response to the user.
 * @returns {Promise<Array<string>|null>} Updated context array if successful, null if chat not found or invalid data.
 *
 * @description Appends the new question and answer to the context array with "USER:" and "SYSTEM:" prefixes.
 * If context exceeds 11 messages, automatically summarizes the conversation using Gemini AI
 * and replaces the context with a single summary message. Updates both MongoDB and Redis cache.
 *
 * @example
 * const updatedContext = await addToContextData("chat_12345", {
 *   userQuestion: "What's the weather?",
 *   aiAnswer: "It's sunny today."
 * });
 * console.log(updatedContext); // Updated context array with new messages
 */
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
