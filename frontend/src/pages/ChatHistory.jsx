import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LuMessageSquare,
  LuBookmark,
  LuPencil,
  LuTrash2,
  LuClock,
  LuSave,
  LuX,
} from "react-icons/lu";
import { getChats } from "../services/getChatsService";
import { useChatOperations } from "../hooks/useChatOperations";
import toast from "react-hot-toast";

export default function ChatHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const { updateTitle, toggleBookmark, deleteChatById } = useChatOperations();

  const showBookmarked = searchParams.get("filter") === "bookmarked";
  const filteredChats = showBookmarked
    ? chats.filter((c) => c.bookmarked)
    : chats;

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const result = await getChats();
    setChats(result.success ? result.data.chats : []);
    setLoading(false);
    if (!result.success) toast.error("Failed to load chats");
  };

  const updateChat = (chatId, updates) => {
    setChats(
      chats.map((chat) =>
        chat._id === chatId ? { ...chat, ...updates } : chat
      )
    );
  };

  const handleToggleBookmark = async (chat) => {
    const newStatus = !chat.bookmarked;
    updateChat(chat._id, { bookmarked: newStatus });
    const result = await toggleBookmark(
      chat._id,
      chat.chatName,
      chat.bookmarked
    );
    if (result.revert) {
      updateChat(chat._id, { bookmarked: !newStatus });
    }
  };

  const handleSaveEdit = async (chat) => {
    const newTitle = editTitle.trim() || "Chat";
    const oldTitle = chat.chatName;
    setEditingId(null);
    updateChat(chat._id, { chatName: newTitle });
    const result = await updateTitle(chat._id, newTitle, chat.bookmarked);
    if (result.revert) {
      updateChat(chat._id, { chatName: oldTitle });
    }
  };

  const handleDelete = async (chatId) => {
    if (!confirm("Delete this chat?")) return;
    setChats(chats.filter((c) => c._id !== chatId));
    const res = await deleteChatById(chatId);
    if (!res.success) {
      fetchChats();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full px-6 py-6">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold mb-6">Chat History</h1>
          <div className="flex gap-6 mb-6 text-sm">
            <button
              onClick={() => setSearchParams({})}
              aria-label="Show all chats"
              className={`flex items-center gap-2 pb-2 border-b-2 transition ${
                !showBookmarked
                  ? "border-info  text-info font-semibold"
                  : "border-transparent cursor-pointer text-base-content/60 hover:text-base-content"
              }`}>
              <LuMessageSquare className="w-4 h-4" />
              All Chats
            </button>
            <button
              onClick={() => setSearchParams({ filter: "bookmarked" })}
              aria-label="Show bookmarked chats"
              className={`flex items-center gap-2 pb-2 border-b-2 transition ${
                showBookmarked
                  ? "border-info text-info font-semibold"
                  : "border-transparent cursor-pointer text-base-content/60 hover:text-base-content"
              }`}>
              <LuBookmark className="w-4 h-4" />
              Bookmarked
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
          {filteredChats.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-20">
                <p className="text-base-content/60 mb-4">
                  {showBookmarked ? "No bookmarks yet" : "No chats yet"}
                </p>
                <button
                  onClick={() =>
                    showBookmarked
                      ? setSearchParams({})
                      : navigate("/dashboard")
                  }
                  className="btn btn-primary text-base-100 rounded-xl shadow-lg border-0 hover:bg-primary-600"
                  aria-label={
                    showBookmarked
                      ? "View all chats"
                      : "Start a new conversation"
                  }>
                  {showBookmarked ? "View all chats" : "Start a conversation"}
                </button>
              </div>
            </div>
          )}

          {filteredChats.length > 0 && (
            <div className="space-y-2 pb-4">
              {filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open chat: ${chat.chatName || "Untitled chat"}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!editingId) navigate(`/dashboard/chat/${chat._id}`);
                    }
                  }}
                  className={`p-4 rounded border border-transparent hover:border-primary/30 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                    chat.bookmarked ? "border-l-4 !border-l-info" : ""
                  }`}
                  onClick={() =>
                    !editingId && navigate(`/dashboard/chat/${chat._id}`)
                  }>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {editingId === chat._id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(chat);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="input input-sm w-full max-w-md"
                          aria-label="Edit chat title"
                          autoFocus
                        />
                      ) : (
                        <>
                          <h3 className="font-semibold truncate">
                            {chat.chatName || "Chat"}
                          </h3>
                          <p className="text-xs text-base-content/50 flex items-center gap-1 mt-1">
                            <LuClock className="w-3 h-3" />
                            {new Date(chat.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      {editingId === chat._id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEdit(chat);
                            }}
                            className="btn btn-sm btn-ghost bg-transparent hover:border-primary text-success"
                            aria-label="Save title">
                            <LuSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null);
                            }}
                            className="btn btn-sm btn-ghost bg-transparent hover:border-error"
                            aria-label="Cancel editing">
                            <LuX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(chat);
                            }}
                            className={`btn btn-sm btn-ghost bg-transparent hover:border-primary ${
                              chat.bookmarked ? "text-info" : ""
                            }`}
                            aria-label={
                              chat.bookmarked
                                ? "Remove bookmark"
                                : "Add bookmark"
                            }>
                            <LuBookmark
                              className={`w-4 h-4 ${
                                chat.bookmarked ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(chat._id);
                              setEditTitle(chat.chatName || "Chat");
                            }}
                            className="btn btn-sm btn-ghost bg-transparent hover:border-primary"
                            aria-label="Edit title">
                            <LuPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(chat._id);
                            }}
                            className="btn btn-sm btn-ghost bg-transparent hover:border-primary text-error"
                            aria-label="Delete chat">
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
