import api from "../lib/api.js";

export const signUp = async (username, email, password) => {
  try {
    const res = await api.post("/users", {
      username,
      email,
      password,
    });

    if (res.status !== 201) {
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
      message: error.response.data.error || "An error occurred during sign up.",
    };
  }
};
