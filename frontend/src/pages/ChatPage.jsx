import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { LuArrowLeft } from "react-icons/lu";
import toast from "react-hot-toast";

import { getChat } from "../services/getChat";
import { getCharacter } from "../services/getCharacterService";
import { sendMessage } from "../services/sendMessageService";
import { NavbarContext } from "../context/NavbarContext";
import { AuthContext } from "../context/AuthContext";
import { CharacterThemeProvider } from "../context/CharacterThemeContext";

import ChatBackground from "../components/chat/ChatBackground";
import CharacterHeader from "../components/chat/CharacterHeader";
import MessageList from "../components/chat/MessageList";
import QuickReplies from "../components/chat/QuickReplies";
import ChatInput from "../components/chat/ChatInput";

export default function ChatPage() {
  const { chatId } = useParams();
  const [chatMessages, setChatMessages] = useState(null);
  const [character, setCharacter] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const { setNavBarTitle, setShowBookmarkIcon, setChatID, setIsBookmarked } =
    useContext(NavbarContext);
  const { loading, setLoading } = useContext(AuthContext);
  const [initialLoading, setInitialLoading] = useState(chatMessages === null);

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
        setInitialLoading(false);
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

  const theme = character?.theme || {};

  if (initialLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <CharacterThemeProvider themeData={theme}>
      <div
        className="flex flex-col h-full w-full relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: theme.backgroundColor || undefined,
          fontFamily: theme.fontFamily || undefined,
          "--theme-primary": theme.primaryColor || "oklch(66.89% 0.13 233.91)",
          "--theme-send": theme.sendButtonColor || "oklch(66.89% 0.13 233.91)",
          "--theme-input-border": "oklch(66.89% 0.13 233.91)",
          "--theme-send-text": theme.sendButtonColor ? "#000000" : "#000000",
        }}>
        {/* Background Layers */}
        <ChatBackground theme={theme} />

        {/* Main Content */}
        <section className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-base-600 scrollbar-track-transparent">
          <div className="sm:w-4/5 xl:w-3/5 sm:mx-auto w-full pb-4">
            {/* Back Button */}
            <a
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors pt-4">
              <LuArrowLeft className="w-6 h-6 cursor-pointer" />
              Back to Dashboard
            </a>

            {/* Character Header */}
            <CharacterHeader character={character} theme={theme} />

            {/* Messages */}
            <MessageList
              messages={chatMessages}
              character={character}
              theme={theme}
              isLoading={chatLoading}
            />
          </div>
        </section>

        {/* Input Area */}
        <section className="relative z-10 w-full px-4 mt-auto mb-6 shrink-0">
          <div className="sm:w-4/5 xl:w-3/5 sm:mx-auto w-full">
            <QuickReplies
              options={quickReplies}
              onSelect={handleSendMessage}
              disabled={loading || chatLoading}
            />

            <ChatInput
              onSend={handleSendMessage}
              disabled={loading || chatLoading}
              theme={theme}
            />
          </div>
        </section>
      </div>
    </CharacterThemeProvider>
  );
}
