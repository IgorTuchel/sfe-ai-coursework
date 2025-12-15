/**
 * @file sendMessageService.js
 * @description Service for sending messages in a chat.
 * Sends a POST request to the backend API and handles responses and errors.
 * @module services/sendMessageService
 */

import api from "../lib/api.js";

export const sendMessage = async (chatID, message) => {
  try {
    const res = await api.post(`/chat/${chatID}`, { message });
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        "An error occurred while sending the message.",
    };
  }
};
