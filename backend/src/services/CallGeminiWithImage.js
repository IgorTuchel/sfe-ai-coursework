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
  console.log("Might need image:", mightNeedImage);
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

  console.log("Using prompt:");
  const response = await callGemini(promptToUse, userMessage);
  console.log("Gemini response:");
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
