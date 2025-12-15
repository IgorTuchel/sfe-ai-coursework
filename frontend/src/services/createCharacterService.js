/**
 * @file createCharacterService.js
 * @description Service for creating a new character.
 * Handles form data submission, including file uploads, and error handling.
 * @module services/createCharacterService
 */

import api from "../lib/api.js";

export const createCharacter = async (characterData) => {
  try {
    const data = new FormData();
    for (const key in characterData) {
      data.append(key, characterData[key]);
    }

    const res = await api.post("/characters", data, {
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
      error:
        error.response?.data?.error ||
        "An error occurred while creating the character.",
    };
  }
};
