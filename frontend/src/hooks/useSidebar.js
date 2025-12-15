/**
 * @file useSidebar.js
 * @description Custom React hook for managing sidebar chat list and search functionality.
 * Handles chat loading and client-side filtering based on search queries.
 * @module hooks/useSidebar
 */

import { useState, useEffect, useContext } from "react";
import { getChats } from "../services/getChatsService";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook for managing sidebar chat list with search functionality.
 *
 * @returns {Object} Hook state and handlers.
 * @returns {Array<Object>} returns.chats - Filtered array of chat objects based on search query.
 * @returns {string} returns.searchQuery - Current search query string.
 * @returns {Function} returns.setSearchQuery - Setter function to update search query.
 *
 * @description Manages sidebar chat list:
 * - Fetches all user chats on mount when authenticated
 * - Provides client-side search filtering by chat name (case-insensitive)
 * - Returns empty array before authentication or while loading
 * - Search is whitespace-trimmed (empty query shows all chats)
 *
 * @example
 * const { chats, searchQuery, setSearchQuery } = useSidebar();
 *
 * return (
 *   <Sidebar>
 *     <SearchInput value={searchQuery} onChange={setSearchQuery} />
 *     <ChatList chats={chats} />
 *   </Sidebar>
 * );
 */
export function useSidebar() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useContext(AuthContext);

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

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    return chat?.chatName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return {
    chats: filteredChats,
    searchQuery,
    setSearchQuery,
  };
}
