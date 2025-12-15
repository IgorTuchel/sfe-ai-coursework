/**
 * @file getChatsService.js
 * @description Service for retrieving a list of chats.
 * Sends a GET request to the backend API and handles responses and errors.
 * @module services/getChatsService
 */

import api from "../lib/api.js";

export const getChats = async () => {
  try {
    const res = await api.get("/chat");
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        "An error occurred while fetching chats.",
    };
  }
};
