/**
 * @file invalidateOtherSessions.js
 * @description Service for invalidating other user sessions by revoking refresh tokens.
 * Sends a POST request to the backend API and handles responses and errors.
 * @module services/invalidateOtherSessions
 */

import api from "../lib/api";

export const invalidateOtherRefreshTokens = async () => {
  try {
    const res = await api.post("/users/revoke-refresh-tokens");
    if (res.status === 200) {
      return { success: true, message: res.data.message };
    }
    return false;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "An error occurred.",
    };
  }
};
