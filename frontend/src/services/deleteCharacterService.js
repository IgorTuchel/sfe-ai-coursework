/**
 * @file deleteCharacterService.js
 * @description Service for deleting a character by ID.
 * Sends a DELETE request to the backend API and handles responses and errors.
 * @module services/deleteCharacterService
 */

import api from "../lib/api";

export const deleteCharacter = async (characterId) => {
  try {
    const res = await api.delete(`/characters/${characterId}`);
    return {
      success: true,
      data: res.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "An error occurred while deleting the character.",
    };
  }
};
