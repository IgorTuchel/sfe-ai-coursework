/**
 * @file resetPasswordService.js
 * @description Service for resetting user passwords.
 * Sends a POST request to the backend API with the reset token and new password.
 * @module services/resetPasswordService
 */

import api from "../lib/api";

export const resetPassword = async (token, newPassword) => {
  try {
    const res = await api.post(`/reset-password/${token}`, {
      password: newPassword,
    });
    if (res.status !== 200) {
      return {
        success: false,
        message: res.data.error,
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "An error occurred while resetting the password.",
    };
  }
};
