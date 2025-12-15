/**
 * @file getCharacterVectorData.js
 * @description Service for retrieving vector data associated with a character.
 * Sends a GET request to the backend API and handles responses and errors.
 * @module services/getCharacterVectorData
 */

import api from "../lib/api";

export const getCharacterVectorData = async (characterID) => {
  try {
    const response = await api.get(`/characters/${characterID}/data`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
