import geminiClient from "../config/gemini.js";

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
      console.log("Error getting embeddings from Gemini after retries:", error);
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
