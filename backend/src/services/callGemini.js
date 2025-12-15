/**
 * @file callGemini.js
 * @description Service for generating text content using Google's Gemini AI.
 * Provides functionality to generate AI responses with system instructions and user prompts
 * with automatic retry logic.
 * @module services/callGemini
 */

import geminiClient from "../config/gemini.js";

/**
 * Generates AI text content using Gemini AI with a system prompt and user prompt.
 *
 * @async
 * @param {string} systemPrompt - System instruction to guide the AI's behavior and response style.
 * @param {string} prompt - User prompt or query for the AI to respond to.
 * @param {number} [retryCount=0] - Current retry attempt count (used internally for recursion).
 * @returns {Promise<Object>} Response object with success status and data or error.
 * @returns {boolean} returns.success - Whether the content generation was successful.
 * @returns {string} [returns.data] - Generated text response from Gemini.
 * @returns {string} [returns.error] - Error message if the operation failed.
 *
 * @example
 * const result = await callGemini(
 *   "You are a helpful assistant.",
 *   "What is the capital of France?"
 * );
 * if (result.success) {
 *   console.log(result.data); // "The capital of France is Paris."
 * } else {
 *   console.error(result.error);
 * }
 */
export async function callGemini(systemPrompt, prompt, retryCount = 0) {
  try {
    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: prompt,
    });
    return {
      success: true,
      data: response.candidates[0].content.parts[0].text,
    };
  } catch (error) {
    if (retryCount < 3) {
      console.warn(
        `Gemini call failed, retrying... (${retryCount + 1})`,
        error
      );
      return await callGemini(systemPrompt, prompt, retryCount + 1);
    } else {
      return {
        success: false,
        error: "Failed to get response from Gemini after multiple attempts.",
      };
    }
  }
}
