import api from "../lib/api.js";

export const getChats = async () => {
  try {
    const res = await api.get("/chat");
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response.data.error || "An error occurred while fetching chats.",
    };
  }
};
