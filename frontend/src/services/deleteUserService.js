import api from "../lib/api";

export const deleteUser = async (mfaCode) => {
  try {
    console.log("Deleting user with MFA code:", mfaCode);
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
