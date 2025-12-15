/**
 * @file callEmbedingGemini.js
 * @description Service for generating text embeddings using Google's Gemini AI.
 * Provides functionality to convert text data into 768-dimensional vector embeddings
 * with automatic retry logic and input validation.
 * @module services/callEmbedingGemini
 */
import geminiClient from "../config/gemini.js";

/**
 * Generates embeddings for an array of text strings using Gemini AI.
 *
 * @async
 * @param {string[]} dataArray - Array of text strings to embed. Each string must be 1-512 characters.
 * @param {number} [retryCount=0] - Current retry attempt count (used internally for recursion).
 * @returns {Promise<Object>} Response object with success status and data or error.
 * @returns {boolean} returns.success - Whether the embedding generation was successful.
 * @returns {Array<{text: string, embedding: number[]}>} [returns.data] - Array of objects containing original text and embedding vectors (768 dimensions).
 * @returns {string} [returns.error] - Error message if the operation failed.
 *
 * @example
 * const result = await getEmbeddingFromGemini(["Hello world", "Test string"]);
 * if (result.success) {
 *   console.log(result.data); // [{ text: "Hello world", embedding: [...] }, ...]
 * } else {
 *   console.error(result.error);
 * }
 */
export async function getEmbeddingFromGemini(dataArray, retryCount = 0) {
  const { success, error } = verifyData(dataArray);
  if (!success) {
    return { success: false, error: error };
  }
  try {
    const response = await geminiClient.models.embedContent({
      model: "gemini-embedding-001",
      contents: dataArray,
      config: {
        embeddingType: "TEXT_EMBEDDING",
        outputDimensionality: 768,
      },
    });
    const embeddedVectors = response.embeddings.map((vector, idx) => ({
      text: dataArray[idx],
      embedding: vector.values,
    }));
    return { success: true, data: embeddedVectors };
  } catch (error) {
    if (retryCount < 3) {
      return await getEmbeddingFromGemini(dataArray, retryCount + 1);
    } else {
      return {
        success: false,
        error: "Error getting embeddings from Gemini after multiple attempts.",
      };
    }
  }
}

const verifyData = (data) => {
  for (const item of data) {
    if (!item || typeof item !== "string") {
      return { success: false, error: "Invalid input text." };
    }
    if (item.length === 0 || item.length > 512) {
      return { success: false, error: "Input text length is invalid." };
    }
  }
  return { success: true };
};
