import {
  LuMenu,
  LuPanelLeftClose,
  LuBookmark,
  LuPen,
  LuSave,
  LuBookmarkCheck,
  LuSettings,
  LuDelete,
  LuCross,
  LuEraser,
} from "react-icons/lu";
import { useContext, useState, useEffect } from "react";
import { NavbarContext } from "../context/NavbarContext.jsx";
import PanelToggle from "./ClosePanel";
import { updateChatService } from "../services/updateChatService.js";
import { deleteChat } from "../services/deleteChatService.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Navbar({ isOpen, setIsOpen }) {
  const {
    navBarTitle,
    setNavBarTitle,
    showBookmarkIcon,
    chatID,
    isBookmarked,
    setIsBookmarked,
  } = useContext(NavbarContext);

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(navBarTitle);

  const navigate = useNavigate();

  useEffect(() => {
    setDraftTitle(navBarTitle);
  }, [navBarTitle]);

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem) {
      elem.blur();
    }
  };

  const handleDeleteChat = async () => {
    closeDropdown();
    const res = await deleteChat(chatID);
    if (res.success) {
      toast.success("Chat deleted successfully");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error("Failed to delete chat: " + res.message);
    }
  };

  const handleStartEdit = () => {
    closeDropdown();
    setDraftTitle(navBarTitle || "Chat");
    setIsEditing(true);
  };

  const handleSaveTitle = async () => {
    const trimmed = draftTitle.trim() || "Chat";

    setIsEditing(false);
    setNavBarTitle?.(trimmed);

    const res = await updateChatService(chatID, trimmed, isBookmarked);
    if (!res.success) {
      toast.error("Failed to save title, reverting: " + res.message);
      setNavBarTitle?.(navBarTitle);
    } else {
      toast.success("Title updated successfully");
    }
  };

  const handleUpdateBookmark = async () => {
    closeDropdown();
    const newBookmarkStatus = !isBookmarked;

    setIsBookmarked(newBookmarkStatus);

    const res = await updateChatService(chatID, navBarTitle, newBookmarkStatus);
    if (!res.success) {
      setIsBookmarked(!newBookmarkStatus);
      toast.error("Failed to update bookmark status");
    }
    toast.success("Bookmark status updated successfully");
  };

  return (
    <div className="navbar shadow-lg gap-2 sm:gap-4 px-2 sm:px-4 bg-base-100">
      <div className="flex-0">
        <PanelToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {chatID && (
        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full justify-center">
              <input
                className="input input-sm input-primary caret-primary input-bordered w-full sm:max-w-xs text-center text-sm sm:text-base"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setDraftTitle(navBarTitle);
                  }
                }}
              />
              <button
                className="btn btn-ghost btn-xs sm:btn-sm flex-shrink-0 p-2 text-success"
                onClick={handleSaveTitle}
                title="Save title">
                <LuSave className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          ) : (
            <span className="text-base sm:text-lg font-semibold truncate cursor-default">
              {navBarTitle || "Chat"}
            </span>
          )}
        </div>
      )}

      {chatID && (
        <div className="flex-0 dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm p-2"
            title="Menu"
            aria-label="Options menu">
            <LuSettings className="w-6 h-6" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-xl border border-base-200">
            <li>
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-2">
                <LuPen className="w-5 h-5" />
                <span>Edit Title</span>
              </button>
            </li>

            {showBookmarkIcon && (
              <li>
                <button
                  onClick={handleUpdateBookmark}
                  className="flex items-center gap-2">
                  {isBookmarked ? (
                    <>
                      <LuBookmarkCheck className="w-5 h-5 text-primary" />
                      <span>Remove Bookmark</span>
                    </>
                  ) : (
                    <>
                      <LuBookmark className="w-5 h-5" />
                      <span>Add Bookmark</span>
                    </>
                  )}
                </button>
              </li>
            )}
            <li>
              <button
                onClick={handleDeleteChat}
                className="flex items-center gap-2 text-error font-bold">
                <LuEraser className="w-5 h-5" />
                <span>Delete Chat</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
