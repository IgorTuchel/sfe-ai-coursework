/**
 * @file callGeminiWithImage.js
 * @description Service for generating AI responses with optional image generation capability.
 * Detects when users request visual content and automatically generates images using Gemini Imagen,
 * embedding them in the response.
 * @module services/callGeminiWithImage
 */

import { callGemini } from "./callGemini.js";
import { generateImage } from "./callGeminiImage.js";

/**
 * Generates AI text responses with automatic image generation when visual content is requested.
 *
 * @async
 * @param {string} systemPrompt - System instruction to guide the AI's behavior and response style.
 * @param {string} userMessage - User's message or query.
 * @returns {Promise<Object>} Response object with success status and data or error.
 * @returns {boolean} returns.success - Whether the operation was successful.
 * @returns {string} [returns.data] - Generated text response, optionally with embedded image URL in [[CONTENT-IMAGE]] tags.
 * @returns {string} [returns.error] - Error message if the operation failed.
 *
 * @description Detects image-related keywords in the user message (show, draw, create, picture, image, photo,
 * look like, visualize, generate). If detected, augments the system prompt to instruct the AI to use
 * "IMAGE_NEEDED: [description]" format when appropriate. Automatically generates the requested image
 * and embeds the URL in the response with [[CONTENT-IMAGE]] delimiters.
 *
 * @example
 * const result = await callGeminiWithImage(
 *   "You are a history expert.",
 *   "Show me what the Enigma machine looks like"
 * );
 * if (result.success) {
 *   // Response includes: "Here's the Enigma machine.\n\n[[CONTENT-IMAGE]]https://...[[CONTENT-IMAGE]]"
 *   console.log(result.data);
 * }
 *
 * @example
 * const result = await callGeminiWithImage(
 *   "You are a helpful assistant.",
 *   "What is the capital of France?"
 * );
 * // No image keywords detected, returns standard text response
 */
export async function callGeminiWithImage(systemPrompt, userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  const imageKeywords = [
    "show",
    "draw",
    "create",
    "picture",
    "image",
    "photo",
    "look like",
    "visualize",
    "generate",
  ];
  const mightNeedImage = imageKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  let promptToUse = systemPrompt;
  if (mightNeedImage) {
    promptToUse = `${systemPrompt}

---
IMPORTANT CAPABILITY:
Although you communicate through text, this modern system has the capability to generate visual representations when users ask to "see" or "show" something. 

When a user asks to visualize something related to your work or era (e.g., "show me the Enigma machine"), you should:

1. Use this exact format:
   IMAGE_NEEDED: [detailed visual description for image generation]

2. Then respond naturally, acknowledging that you're providing a visual

EXAMPLE:
User: "Can you show me the Enigma machine?"

Your response:
IMAGE_NEEDED: A detailed color photograph of a WWII-era Enigma encryption machine, showing the keyboard, lampboard, three visible rotors with alphabet markings, and the plugboard with cables. Museum lighting, front-angle view.

Then continue with your response

Do NOT refuse image requests by saying you cannot provide visuals. This system supports it. Only refuse if the request is inappropriate for your character or time period.
`;
  }

  const response = await callGemini(promptToUse, userMessage);
  if (!response.success) {
    return response;
  }

  const responseText = response.data;
  const imageMatch = responseText.match(/IMAGE_NEEDED:\s*(.+?)(?:\n|$)/i);

  if (imageMatch) {
    const imageDescription = imageMatch[1].trim();
    const imageResult = await generateImage(imageDescription);
    const cleanedText = responseText
      .replace(/IMAGE_NEEDED:.+?(?:\n|$)/i, "")
      .trim();

    if (imageResult.success) {
      return {
        success: true,
        data: `${cleanedText}\n\n[[CONTENT-IMAGE]]${imageResult.imageUrl}[[CONTENT-IMAGE]]`,
      };
    } else {
      return {
        success: true,
        data: cleanedText,
      };
    }
  }

  return response;
}
