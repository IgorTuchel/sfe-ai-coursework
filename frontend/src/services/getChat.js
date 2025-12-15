/**
 * @file getChat.js
 * @description Service for retrieving chat details by ID.
 * Sends a GET request to the backend API and handles responses and errors.
 * @module services/getChat
 */

import api from "../lib/api.js";

export const getChat = async (chatID) => {
  try {
    const res = await api.get(`/chat/${chatID}`);
    return {
      success: true,
      data: res.data.chat,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "An error occurred while fetching the chat.",
    };
  }
};
