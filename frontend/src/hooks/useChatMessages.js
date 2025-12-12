import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { getChat } from "../services/getChat";
import { getCharacter } from "../services/getCharacterService";
import { sendMessage } from "../services/sendMessageService";
import { NavbarContext } from "../context/NavbarContext";
import { AuthContext } from "../context/AuthContext";

export function useChatMessages() {
  const { chatId } = useParams();
  const [chatMessages, setChatMessages] = useState(null);
  const [character, setCharacter] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const { setNavBarTitle, setShowBookmarkIcon, setChatID, setIsBookmarked } =
    useContext(NavbarContext);
  const { loading, setLoading } = useContext(AuthContext);

  const initialLoading = chatMessages === null;

  // Fetch chat and character data
  useEffect(() => {
    async function fetchData(chatId) {
      setLoading(true);
      try {
        const data = await getChat(chatId);
        if (data.success) {
          setNavBarTitle(data.data.chatName);
          setShowBookmarkIcon(true);
          setIsBookmarked(data.data.bookmarked);
          setChatID(chatId);
          setChatMessages(data.data.messages);

          const characterData = await getCharacter(data.data.characterID);
          if (characterData.success) {
            setCharacter(characterData.data);
          }
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
        toast.error("Failed to load chat");
      } finally {
        setLoading(false);
      }
    }
    fetchData(chatId);
  }, [
    chatId,
    setNavBarTitle,
    setShowBookmarkIcon,
    setChatID,
    setIsBookmarked,
    setLoading,
  ]);

  const handleSendMessage = async (messageText) => {
    const userMsg = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setChatLoading(true);
    setChatMessages((prev) => [...prev, userMsg]);
    setQuickReplies([]);

    try {
      const response = await sendMessage(chatId, messageText);

      if (response.success) {
        setChatMessages((prev) => [...prev, response.data]);
        if (response.data.options && Array.isArray(response.data.options)) {
          setQuickReplies(response.data.options);
        }
      } else {
        toast.error("Failed to send message: " + response.message);
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setChatLoading(false);
    }
  };

  return {
    chatMessages,
    character,
    quickReplies,
    chatLoading,
    loading,
    initialLoading,
    handleSendMessage,
  };
}
