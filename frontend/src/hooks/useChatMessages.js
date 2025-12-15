/**
 * @file useChatMessages.js
 * @description Custom React hook for managing chat conversations and messages.
 * Handles message loading, sending, and real-time UI updates with quick reply suggestions.
 * @module hooks/useChatMessages
 */

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { getChat } from "../services/getChat";
import { getCharacter } from "../services/getCharacterService";
import { sendMessage } from "../services/sendMessageService";
import { NavbarContext } from "../context/NavbarContext";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook for managing chat messages and conversation state.
 *
 * @returns {Object} Hook state and handlers.
 * @returns {Array<Object>|null} returns.chatMessages - Array of message objects (role, content, timestamp), null while loading.
 * @returns {Object|null} returns.character - Character data for the current chat.
 * @returns {Array<string>} returns.quickReplies - Suggested quick reply options from AI responses.
 * @returns {boolean} returns.chatLoading - Loading state for message sending.
 * @returns {boolean} returns.loading - Global loading state from AuthContext.
 * @returns {boolean} returns.initialLoading - True while initial chat data is being fetched.
 * @returns {Function} returns.handleSendMessage - Function to send a new message to the chat.
 *
 * @description Manages chat conversation lifecycle:
 * - Fetches chat messages and character data on mount using chatId from URL params
 * - Updates navbar with chat name, bookmark status, and chat ID
 * - Handles optimistic UI updates (adds user message immediately)
 * - Processes AI responses and extracts quick reply options
 * - Provides toast notifications for errors
 *
 * @example
 * const {
 *   chatMessages,
 *   character,
 *   quickReplies,
 *   chatLoading,
 *   initialLoading,
 *   handleSendMessage
 * } = useChatMessages();
 *
 * if (initialLoading) return <LoadingSpinner />;
 *
 * return (
 *   <ChatView
 *     messages={chatMessages}
 *     character={character}
 *     onSend={handleSendMessage}
 *     quickReplies={quickReplies}
 *     sending={chatLoading}
 *   />
 * );
 */
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
