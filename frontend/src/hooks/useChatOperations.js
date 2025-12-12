import { updateChatService } from "../services/updateChatService";
import { deleteChat } from "../services/deleteChatService";
import toast from "react-hot-toast";

export function useChatOperations() {
  const updateTitle = async (chatId, newTitle, bookmarked) => {
    const trimmedTitle = newTitle.trim() || "Chat";

    const res = await updateChatService(chatId, trimmedTitle, bookmarked);

    if (!res.success) {
      toast.error("Failed to save title");
      return { success: false, revert: true };
    }

    toast.success("Title updated successfully");
    return { success: true, newTitle: trimmedTitle };
  };

  const toggleBookmark = async (chatId, chatName, currentBookmarkStatus) => {
    const newStatus = !currentBookmarkStatus;

    const res = await updateChatService(chatId, chatName, newStatus);

    if (!res.success) {
      toast.error("Failed to update bookmark");
      return { success: false, revert: true };
    }

    return { success: true, newStatus };
  };

  const deleteChatById = async (chatId) => {
    const res = await deleteChat(chatId);

    if (res.success) {
      toast.success("Chat deleted successfully");
    } else {
      toast.error("Failed to delete chat: " + res.message);
    }

    return res;
  };

  return {
    updateTitle,
    toggleBookmark,
    deleteChatById,
  };
}
