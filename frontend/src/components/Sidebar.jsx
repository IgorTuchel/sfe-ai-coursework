import { useEffect } from "react";
import ChatSearch from "./sidebar/ChatSearch.jsx";
import ChatList from "./sidebar/ChatList.jsx";
import SidebarHeader from "./sidebar/SidebarHeader.jsx";
import SidebarActions from "./sidebar/SidebarActions.jsx";
import UserProfile from "./sidebar/UserProfile.jsx";
import { useSidebar } from "../hooks/useSidebar.js";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { chats, searchQuery, setSearchQuery } = useSidebar();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          flex flex-col h-screen overflow-hidden shadow-lg bg-base-700 z-50
          fixed left-0 top-0
          transition-transform duration-300 ease-in-out
          md:w-72 md:flex-shrink-0
          ${isOpen ? "translate-x-0 md:relative" : "-translate-x-full"}
        `}
        aria-hidden={!isOpen}
        role="navigation"
        aria-label="Main sidebar navigation">
        {/* Skip Link - Only visible on keyboard focus */}

        <SidebarHeader isOpen={isOpen} setIsOpen={setIsOpen} />

        <SidebarActions />

        <section className="flex-1 overflow-y-auto px-4 flex flex-col">
          <ChatSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <a href="#user-profile" className="skip-link">
            Skip to User Profile
          </a>
          <ChatList chats={chats} />
        </section>

        <UserProfile id="user-profile" />
      </aside>
    </>
  );
}
