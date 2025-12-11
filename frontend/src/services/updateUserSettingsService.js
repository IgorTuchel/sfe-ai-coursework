import api from "../lib/api";

export async function updateUserSettings(settings) {
  try {
    const res = await api.put("/users", settings, {
      withCredentials: true,
    });

    if (res.status === 403) {
      if (res.data.type === "MFA_REQUIRED") {
        return {
          success: false,
          mfaRequired: true,
          message: res.data.error,
        };
      }
    }

    if (res.status !== 200) {
      return {
        success: false,
        error: res.data.error || "Failed to update settings",
      };
    }

    return {
      success: true,
      data: res.data,
    };
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
