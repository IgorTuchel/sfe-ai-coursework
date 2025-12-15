/**
 * @file updateCharacterVectorData.js
 * @description Service for updating character vector data.
 * Sends a PUT request to the backend API with new text data for a specific character and vector store.
 * @module services/updateCharacterVectorData
 */

import api from "../lib/api";

export const updateCharacterVectorData = async (
  characterID,
  dataVectorStoreId,
  newText
) => {
  try {
    const res = await api.put(
      `/characters/${characterID}/data/${dataVectorStoreId}`,
      {
        dataArray: [newText],
      }
    );
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
