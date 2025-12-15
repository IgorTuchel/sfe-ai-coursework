/**
 * @file createCharacterVectorData.js
 * @description Service for creating vector data for a character.
 * Sends vector data to the backend API and handles responses and errors.
 * @module services/createCharacterVectorData
 */

import api from "../lib/api";

export const createCharacterVectorData = async (characterID, dataArray) => {
  try {
    const res = await api.post(`/characters/${characterID}/data`, {
      dataArray,
    });
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
