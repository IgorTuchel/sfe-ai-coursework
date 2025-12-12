import { callGemini } from "./callGemini.js";
import { generateImage } from "./callGeminiImage.js";

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
IMAGE GENERATION:
When users ask to see, show, or visualize something, you can generate images.
Deny the request if it doesnt fit the personality or guidelines.
Image generation should be used sparingly and only when it adds significant value to the response.
Image generation should only generate images that the personality would realistically be able to provide.
Include this marker: IMAGE_NEEDED: [detailed description]
Then continue your natural response. Only use when visuals genuinely help.`;
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
        data: `${cleanedText}\n\n[[CONTENT-IMAGE]${imageResult.imageUrl}[[CONTENT-IMAGE]]`,
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
