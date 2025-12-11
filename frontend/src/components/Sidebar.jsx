import {
  LuMenu,
  LuPanelLeftClose,
  LuPlus,
  LuSearch,
  LuChevronsRight,
  LuBookmark,
  LuSettings2,
  LuLogOut,
  LuUser,
  LuMessageCircle,
  LuMessageCircleCode,
  LuMessageCircleMore,
} from "react-icons/lu";
import { useState, useEffect, useContext } from "react";
import RecentChat from "./RecentChatHistory";
import { getChats } from "../services/getChatsService";
import { AuthContext } from "../context/AuthContext";
import PanelToggle from "./ClosePanel";
import toast from "react-hot-toast";
import { logout } from "../services/logoutService";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  useEffect(() => {
    async function fetchChats() {
      if (isAuthenticated) {
        const result = await getChats();
        if (result.success) {
          setChats(result.data.chats);
        }
      }
    }
    fetchChats();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully.");
      setIsAuthenticated(false);
      return;
    }
    toast.error(result.message || "Logging out...");
  };

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem) elem.blur();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`
    flex flex-col h-screen overflow-hidden shadow-lg bg-base-700 z-50
    fixed
    left-0 top-0
    transition-transform duration-300 ease-in-out
    md:w-72
    md:flex-shrink-0
    ${isOpen ? "translate-x-0 md:relative " : "-translate-x-full"}
  `}
        aria-hidden={!isOpen}>
        <div className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-3">
            <img
              src="https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/logo-icon.png"
              alt="History.Ai Logo"
              className="object-contain w-12 h-12"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-2xl leading-tight">History.ai</h2>
              <span className="text-xs opacity-70">
                Talk to historical legends
              </span>
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <PanelToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        <hr className="mb-4 w-full border-white/10" />

        <section className="px-4 mb-4 flex flex-col gap-3">
          <a
            href="/dashboard"
            className="btn btn-primary border-0 bg-primary-700 text-lg text-white w-full gap-2 shadow-lg"
            aria-label="New Chat">
            Start Chat
            <LuMessageCircleMore className="w-5 h-5" />
          </a>

          <a
            href="/bookmarks"
            className="btn btn-ghost btn-sm justify-start w-full gap-3 text-base-content/80 hover:bg-base-600/50 border-0"
            aria-label="Bookmarks">
            <LuBookmark className="w-4 h-4" />
            Bookmarks
          </a>
        </section>

        <section className="flex-1 overflow-y-auto px-4 flex flex-col">
          <a
            href="/history"
            className="text-xs font-bold mb-3 text-primary justify-between flex items-center"
            aria-label="Chat History">
            <span>CHAT HISTORY</span>
            <LuChevronsRight className="inline-block ml-1 w-4 h-4 opacity-60" />
          </a>

          <label className="input input-primary input-sm rounded-lg input-bordered flex items-center flex-shrink-0 gap-2 bg-base-100/50 border-primary/30 focus-within:border-primary mb-4 transition-colors w-full">
            <LuSearch className="w-4 h-4 opacity-60" />
            <input
              type="text"
              className="grow bg-transparent caret-primary text-base-content placeholder-base-content/40"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {chats
              .filter((chat) => {
                if (chat?.chatName && searchQuery.trim() !== "") {
                  return chat?.chatName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                }
                return true;
              })
              .map((chat) => (
                <a
                  href={`/dashboard/chat/${chat._id}`}
                  key={chat._id}
                  className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-100/30 transition-all group hover:border-primary focus:border-primary focus:outline-none border border-transparent"
                  aria-label={`Go To Conversation ${chat?.chatName}`}>
                  <RecentChat chat={chat} />
                </a>
              ))}
          </div>
        </section>

        <div className="p-4 mt-auto border-t border-white/10">
          <div className="dropdown dropdown-top w-full">
            <div
              tabIndex={0}
              role="button"
              className="flex flex-row space-x-3 items-center hover:bg-base-600/50 transition-colors cursor-pointer p-2 rounded-lg w-full">
              <div className="avatar">
                <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                    alt="Default User Avatar"
                  />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-medium text-sm truncate max-w-[120px]">
                  {user?.username || "Guest"}
                </span>
                <span className="text-xs text-white/70">
                  Member Since{" "}
                  <span className="font-semibold text-primary">
                    {user?.createdAt?.slice(0, 4) || "2024"}
                  </span>
                </span>
              </div>
              <LuSettings2 className="ml-auto w-5 h-5 text-primary opacity-80" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-full mb-2 border border-base-content/10">
              <li>
                <a href="/profile" onClick={closeDropdown} className="gap-3">
                  <LuUser className="w-4 h-4" />
                  User Settings
                </a>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-error bg-transparent text-error hover:text-error hover:bg-error/10">
                  <LuLogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
