/**
 * @file useChatOperations.js
 * @description Custom React hook for chat management operations.
 * Provides functions for updating chat titles, toggling bookmarks, and deleting chats
 * with toast notifications and error handling.
 * @module hooks/useChatOperations
 */

import { updateChatService } from "../services/updateChatService";
import { deleteChat } from "../services/deleteChatService";
import toast from "react-hot-toast";

/**
 * Custom hook for managing chat operations (update, bookmark, delete).
 *
 * @returns {Object} Chat operation handlers.
 * @returns {Function} returns.updateTitle - Updates chat title with validation and fallback.
 * @returns {Function} returns.toggleBookmark - Toggles chat bookmark status.
 * @returns {Function} returns.deleteChatById - Deletes a chat by ID.
 *
 * @description Provides reusable chat management functions with built-in:
 * - Toast notifications for success/error states
 * - Input validation (title trimming with "Chat" fallback)
 * - Optimistic update support (returns revert flag on failure)
 *
 * @example
 * const { updateTitle, toggleBookmark, deleteChatById } = useChatOperations();
 *
 * // Update chat title
 * const result = await updateTitle("chat123", "New Title", false);
 * if (result.revert) {
 *   // Revert UI to previous state
 * }
 *
 * @example
 * // Toggle bookmark
 * const result = await toggleBookmark("chat123", "My Chat", true);
 * if (result.success) {
 *   setBookmarked(result.newStatus);
 * }
 */
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
