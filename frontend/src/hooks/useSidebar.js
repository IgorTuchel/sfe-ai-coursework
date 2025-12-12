import { useState, useEffect, useContext } from "react";
import { getChats } from "../services/getChatsService";
import { AuthContext } from "../context/AuthContext";

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
