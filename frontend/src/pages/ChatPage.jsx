import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router";
import { getChat } from "../services/getChat";
import { LuSendHorizontal, LuArrowLeft } from "react-icons/lu";
import MessageSenderSystem from "../components/MessageSenderSystem";
import { getCharacter } from "../services/getCharacterService";
import MessageSenderUser from "../components/MessageSenderUser";
import { sendMessage } from "../services/sendMessageService";
import { NavbarContext } from "../context/NavbarContext";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { CharacterThemeProvider } from "../context/CharacterThemeContext";

const DEFAULT_THEME = {
  backgroundColor: "#050505",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
  backgroundOverlayOpacity: 0.7,
  primaryColor: "#00ff41",
  userMessageColor: "#000000",
  secondaryColor: "#1a1a1a",
  systemMessageColor: "#00ff41",
  bubbleOpacity: 0.9,
  bubbleBorderRadius: "0px",
  inputBackgroundColor: "#000000",
  inputTextColor: "#00ff41",
  inputBorderColor: "#00ff41",
  sendButtonColor: "#00ff41",
};
// const DEFAULT_THEME = {};
export default function ChatPage() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(null);
  const [character, setCharacter] = useState(null);

  const currentTheme =
    character?.theme && Object.keys(character.theme).length > 0
      ? character.theme
      : DEFAULT_THEME;

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);
  const MAX_LENGTH = 512;

  const { setNavBarTitle, setShowBookmarkIcon, setChatID, setIsBookmarked } =
    useContext(NavbarContext);
  const { loading, setLoading } = useContext(AuthContext);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function fetchData(chatId) {
      setLoading(true);
      const data = await getChat(chatId);
      if (data.success) {
        setNavBarTitle(data.data.chatName);
        setShowBookmarkIcon(true);
        setIsBookmarked(data.data.bookmarked);
        setChatID(chatId);
        setChatMessages(data.data.messages);
      }
      const characterData = await getCharacter(data.data.characterID);
      if (characterData.success) {
        setCharacter(characterData.data);
      }
      setLoading(false);
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

  useEffect(() => {
    if ((chatMessages && chatMessages.length > 0) || loading) {
      const delay = isInitialLoad.current ? 500 : 0;
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        isInitialLoad.current = false;
      }, delay);
    }
  }, [chatMessages, loading]);

  const handleSend = async (e, manualText = null) => {
    if (e) e.preventDefault();
    const textToSend = manualText || message;

    if (textToSend.trim()) {
      const userMsg = {
        role: "user",
        content: textToSend.trim(),
        timestamp: new Date(),
      };
      setChatLoading(true);
      setChatMessages((prev) => [...prev, userMsg]);
      setMessage("");
      setQuickReplies([]);

      const response = await sendMessage(chatId, textToSend);

      if (response.success) {
        setChatMessages((prev) => [...prev, response.data]);
        if (response.data.options && Array.isArray(response.data.options)) {
          setQuickReplies(response.data.options);
        }
        setChatLoading(false);
      } else {
        toast.error("Failed to send message: " + response.message);
        setChatLoading(false);
      }
    }
  };

  return (
    <CharacterThemeProvider themeData={currentTheme}>
      <div
        className="flex flex-col h-full w-full relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: currentTheme.backgroundColor || undefined,
          fontFamily: currentTheme.fontFamily || undefined,

          // CSS Variables for dynamic styling
          "--theme-primary":
            currentTheme.primaryColor || "oklch(66.89% 0.13 233.91)",
          "--theme-send":
            currentTheme.sendButtonColor || "oklch(66.89% 0.13 233.91)",
          "--theme-input-border": "oklch(66.89% 0.13 233.91)",
          "--theme-send-text": currentTheme.sendButtonColor
            ? "#000000"
            : "#000000",
        }}>
        {/* Layer 1: Wallpaper */}
        {currentTheme.backgroundImageUrl && (
          <div
            className="absolute inset-0 z-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${currentTheme.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Layer 2: Overlay */}
        {currentTheme.backgroundImageUrl && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundColor: `rgba(0,0,0, ${
                currentTheme.backgroundOverlayOpacity ?? 0.5
              })`,
              backdropFilter: "blur(1px)",
            }}
          />
        )}

        {/* Layer 3: Content */}
        <section className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-base-600 scrollbar-track-transparent">
          <div className="sm:w-4/5 xl:w-3/5 sm:mx-auto w-full pb-4">
            <a
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors pt-4">
              <LuArrowLeft className="w-6 h-6 cursor-pointer" />
              Back to Dashboard
            </a>

            <div className="flex gap-3 w-full flex-col justify-center items-center mt-4">
              <div className="avatar">
                <div className="w-36 h-36 border-2 border-(--theme-primary) p-1 rounded-full">
                  <img
                    className="rounded-full"
                    alt={character?.name}
                    src={character?.avatarUrl}
                  />
                </div>
              </div>
              <div className="flex flex-col text-center gap-2 w-[50%]">
                <h2
                  className="text-2xl font-bold text-center"
                  style={{
                    color: currentTheme.systemMessageColor || undefined,
                  }}>
                  {character?.name}
                </h2>
                <p className="text-sm text-center text-base-content/70">
                  {character?.description}
                </p>
              </div>
            </div>

            <div className="w-full space-y-4 py-4">
              {chatMessages &&
                character &&
                chatMessages.map((msg, index) => {
                  if (msg.role === "system") {
                    return (
                      <MessageSenderSystem
                        key={index}
                        message={msg.content}
                        timestamp={msg.timestamp}
                        character={character}
                      />
                    );
                  } else if (msg.role === "user") {
                    return (
                      <MessageSenderUser
                        key={index}
                        message={msg.content}
                        timestamp={msg.timestamp}
                      />
                    );
                  }
                  return null;
                })}

              {chatLoading && character && (
                <div className="flex gap-3 w-full animate-pulse">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img alt={character.name} src={character.avatarUrl} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div
                      className="text-sm text-primary font-semibold"
                      style={{
                        color: currentTheme.secondaryColor || undefined,
                      }}>
                      {character.name}
                      <span className="text-xs text-base-content/50 font-normal ml-2">
                        Thinking...
                      </span>
                    </div>
                    <div
                      className="w-fit bg-base-500 shadow-sm text-white rounded-lg px-4 py-3 rounded-tl-none"
                      style={{
                        backgroundColor:
                          currentTheme.secondaryColor || undefined,
                        opacity: currentTheme.bubbleOpacity || 1,
                        borderRadius:
                          currentTheme.bubbleBorderRadius || "0.75rem",
                        borderTopLeftRadius: "0px",
                      }}>
                      <span className="loading loading-dots loading-sm text-white"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* Layer 3: Input Area */}
        <section className="relative z-10 w-full px-4 mt-auto mb-6 shrink-0">
          <div className="sm:w-4/5 xl:w-3/5 sm:mx-auto w-full">
            {/* QUICK REPLIES */}
            {quickReplies.length > 0 && !loading && (
              <div className="flex flex-wrap gap-2 mb-3 justify-end animate-fade-in-up">
                <span className="w-full text-right text-xs font-medium text-base-content/50 mb-1">
                  Suggested Responses:
                </span>
                {quickReplies.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(null, option.nextNode)}
                    disabled={loading || chatLoading}
                    className="btn btn-sm btn-outline rounded-xl transition-all shadow-sm border-2 font-normal normal-case 
                               border-(--theme-primary) text-(--theme-primary) 
                               hover:bg-(--theme-primary)  hover:text-black
                               outline-none focus:ring-2 focus:ring-(--theme-primary)">
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            <form className="w-full" onSubmit={handleSend}>
              <div
                className={`transition-all p-3 flex flex-col gap-2 shadow-lg border rounded-xl ${
                  !currentTheme.inputBackgroundColor
                    ? "bg-base-700 border-base-600"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    currentTheme.inputBackgroundColor || undefined,
                  borderColor: isInputFocused
                    ? currentTheme.primaryColor || "var(--theme-primary)"
                    : currentTheme.inputBorderColor || "transparent",
                  borderRadius: currentTheme.bubbleBorderRadius || "0.75rem",
                }}>
                <textarea
                  className="w-full bg-transparent resize-none outline-none border-none caret-primary min-h-12 text-sm leading-relaxed"
                  style={{
                    color: currentTheme.inputTextColor || "#ffffff",
                    caretColor: currentTheme.sendButtonColor || undefined,
                  }}
                  placeholder={
                    chatLoading ? "Waiting for reply..." : "Send a message..."
                  }
                  rows={1}
                  value={message}
                  disabled={loading || chatLoading}
                  onChange={(e) =>
                    setMessage(e.target.value.slice(0, MAX_LENGTH))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
                  }}
                  maxLength={MAX_LENGTH}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />

                <div
                  className="flex items-center justify-between gap-3 pt-2 border-t"
                  style={{
                    borderColor:
                      currentTheme.inputBorderColor || "rgba(255,255,255,0.1)",
                  }}>
                  <span
                    className="text-xs font-medium opacity-50"
                    style={{ color: currentTheme.inputTextColor }}>
                    {message.length}/{MAX_LENGTH}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={loading || chatLoading || !message.trim()}
                      className="btn btn-circle btn-sm disabled:opacity-50 border-0 transition-transform 
                                   bg-(--theme-send) text-(--theme-send-text)
                                   hover:opacity-80 hover:scale-105
                                   outline-none focus:ring-2 focus:ring-(--theme-send)">
                      <LuSendHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </CharacterThemeProvider>
  );
}
