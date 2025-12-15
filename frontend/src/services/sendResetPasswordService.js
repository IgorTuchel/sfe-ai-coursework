/**
 * @file sendResetPasswordService.js
 * @description Service for sending a reset password email.
 * Sends a POST request to the backend API with the user's email.
 * @module services/sendResetPasswordService
 */

import api from "../lib/api";

export const sendResetPassword = async (email) => {
  try {
    const response = await api.post("reset-password", { email });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "An error occurred while sending reset password email.",
    };
  }
};
