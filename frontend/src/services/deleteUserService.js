/**
 * @file deleteUserService.js
 * @description Service for deleting a user account, with optional MFA support.
 * Sends a DELETE request to the backend API and handles responses and errors.
 * @module services/deleteUserService
 */

import api from "../lib/api";

export const deleteUser = async (mfaCode) => {
  try {
    const config = {
      withCredentials: true,
    };

    if (mfaCode) {
      config.headers = {
        "x-mfa-code": mfaCode,
      };
    }

    const res = await api.delete("/users", config);
    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
      };
    }
  } catch (error) {
    if (
      error.response?.status === 403 &&
      error.response?.data?.type === "MFA_REQUIRED"
    ) {
      return {
        success: false,
        mfaRequired: true,
        message: error?.response?.data?.error,
      };
    }

    return {
      success: false,
      error: error.response?.data?.error || "An error occurred during update.",
    };
  }
};
