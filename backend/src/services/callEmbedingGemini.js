import geminiClient from "../config/gemini.js";

export async function getEmbeddingFromGemini(dataArray) {
  const { success, error } = verifyData(dataArray);
  if (!success) {
    return { success: false, error: error };
  }
  try {
    console.log("Requesting embeddings from Gemini for data:", dataArray);
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
    console.error("Error getting embeddings from Gemini:", error);
    return { success: false, error: "Error getting embeddings from Gemini." };
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
