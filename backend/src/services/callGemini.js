import geminiClient from "../config/gemini.js";

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
      return await callGemini(prompt, retryCount + 1);
    } else {
      return {
        success: false,
        error: "Failed to get response from Gemini after multiple attempts.",
      };
    }
  }
}
