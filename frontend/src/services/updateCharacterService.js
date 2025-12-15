/**
 * @file updateCharacterService.js
 * @description Service for updating character details.
 * Sends a PUT request to the backend API with character data.
 * @module services/updateCharacterService
 */

import api from "../lib/api.js";

export const updateCharacter = async (characterID, characterData) => {
  try {
    const data = new FormData();
    for (const key in characterData) {
      data.append(key, characterData[key]);
    }

    const res = await api.put(`/characters/${characterID}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: res.data.character,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};
