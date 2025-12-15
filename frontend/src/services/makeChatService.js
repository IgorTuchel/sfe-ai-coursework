/**
 * @file makeChatService.js
 * @description Service for creating a new chat with a specified character.
 * Sends a POST request to the backend API and handles responses and errors.
 * @module services/makeChatService
 */

import api from "../lib/api.js";

export const makeChat = async (characterID) => {
  try {
    const res = await api.post("/chat", { characterID });
    return {
      success: true,
      data: res.data.chat,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "An error occurred while creating the chat.",
    };
  }
};
