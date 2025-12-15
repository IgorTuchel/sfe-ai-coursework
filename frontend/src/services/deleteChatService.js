/**
 * @file deleteChatService.js
 * @description Service for deleting a chat by ID.
 * Sends a DELETE request to the backend API and handles responses and errors.
 * @module services/deleteChatService
 */

import api from "../lib/api.js";

export const deleteChat = async (chatID) => {
  try {
    const res = await api.delete(`/chat/${chatID}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        "An error occurred while deleting the chat.",
    };
  }
};
