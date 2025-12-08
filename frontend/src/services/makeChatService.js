import api from "../lib/api.js";

export const makeChat = async (characterID) => {
  try {
    const res = await api.post("/chat", { characterID });
    return {
      success: true,
      data: res.data.chat,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "An error occurred while creating the chat.",
    };
  }
};
