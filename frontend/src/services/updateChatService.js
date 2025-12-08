import api from "../lib/api.js";

export const updateChatService = async (chatID, newName, isBookmarked) => {
  try {
    const updateData = {
      newChatName: newName,
      isBookmarked: isBookmarked,
    };
    const res = await api.put(`/chat/${chatID}`, updateData);
    return {
      success: true,
      data: res.data.chat,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "An error occurred while updating the chat.",
    };
  }
};
