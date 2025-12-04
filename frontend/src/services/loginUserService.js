import api from "../lib/api";

export const login = async (
  email,
  password,
  rememberMe = "false",
  mfaCode = ""
) => {
  try {
    const res = await api.post("/users/login", {
      email,
      password,
      rememberMe,
      mfaCode,
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
      message: error.response.data.error || "An error occurred during login.",
    };
  }
};
