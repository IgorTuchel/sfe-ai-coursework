/**
 * @file deleteCharacterVectorData.js
 * @description Service for deleting vector data associated with a character.
 * Sends a DELETE request to the backend API and handles responses and errors.
 * @module services/deleteCharacterVectorData
 */

import api from "../lib/api";

export const deleteCharacterVectorData = async (
  characterID,
  dataVectorStoreId
) => {
  try {
    const res = await api.delete(
      `/characters/${characterID}/data/${dataVectorStoreId}`
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
