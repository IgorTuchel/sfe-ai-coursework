import api from "../lib/api.js";

export const getChat = async (chatID) => {
  try {
    const res = await api.get(`/chat/${chatID}`);
    return {
      success: true,
      data: res.data.chat,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
