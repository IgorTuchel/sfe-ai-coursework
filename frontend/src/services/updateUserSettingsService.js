/**
 * @file updateUserSettingsService.js
 * @description Service for updating user settings.
 * Sends a PUT request to the backend API and handles responses and errors, including MFA requirements.
 * @module services/updateUserSettingsService
 */

import api from "../lib/api";

export async function updateUserSettings(settings) {
  try {
    const res = await api.put("/users", settings, {
      withCredentials: true,
    });

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
        message: error.response.data.error,
      };
    }

    return {
      success: false,
      error: error.response?.data?.error || "An error occurred during update.",
    };
  }
}
