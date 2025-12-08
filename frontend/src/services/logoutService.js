import api from "../lib/api.js";

export const logout = async () => {
  try {
    const res = await api.post("/users/logout");
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response.data.error || "An error occurred while logging out.",
    };
  }
};
