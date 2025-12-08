import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router";
import { getChat } from "../services/getChat";
import {
  LuSend,
  LuMic,
  LuUpload,
  LuArrowUp,
  LuArrowRightFromLine,
  LuArrowRightLeft,
  LuArrowRight,
  LuSendHorizontal,
  LuArrowLeft,
} from "react-icons/lu";
import MessageSenderSystem from "../components/MessageSenderSystem";
import { getCharacter } from "../services/getCharacterService";
import MessageSenderUser from "../components/MessageSenderUser";
import { sendMessage } from "../services/sendMessageService";
import { NavbarContext } from "../context/NavbarContext";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function ChatPage() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(null);
  const [character, setCharacter] = useState(null);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  const MAX_LENGTH = 2048;

  const { setNavBarTitle, setShowBookmarkIcon, setChatID, setIsBookmarked } =
    useContext(NavbarContext);

  const { loading, setLoading } = useContext(AuthContext);

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
    if (chatMessages && chatMessages.length > 0) {
      const delay = isInitialLoad.current ? 500 : 0;

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        isInitialLoad.current = false;
      }, delay);
    }
  }, [chatMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const userMsg = {
        role: "user",
        content: message.trim(),
        timestamp: new Date(),
      };
      setLoading(true);
      setChatMessages((prevMessages) => [...prevMessages, userMsg]);
      setMessage("");
      const response = await sendMessage(chatId, message);
      if (response.success) {
        setChatMessages((prevMessages) => [...prevMessages, response.data]);
        setLoading(false);
      } else {
        toast.error("Failed to send message: " + response.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-base-100 relative">
      <section className="flex-1 min-h-0 overflow-y-auto px-4 sm:w-4/5 xl:w-3/5 sm:mx-auto w-full scrollbar-thin scrollbar-thumb-base-600 scrollbar-track-transparent">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors">
          <LuArrowLeft className=" w-6 h-6 mt-2 mb-4 cursor-pointer" />
          Back to Dashboard
        </a>
        <div className="flex gap-3 w-full flex-col justify-center items-center">
          <div className="avatar ">
            <div className="w-36 h-36 border-2 border-primary p-1 rounded-full">
              <img
                className="rounded-full"
                alt={character?.name}
                src={character?.avatarUrl}
              />
            </div>
          </div>
          <div className="flex flex-col text-center gap-2 w-[50%]">
            <h2 className="text-2xl font-bold text-center">
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
              if (msg.role == "system") {
                return (
                  <MessageSenderSystem
                    key={index}
                    message={msg.content}
                    timestamp={msg.timestamp}
                    character={character}
                  />
                );
              } else if (msg.role == "user") {
                return (
                  <MessageSenderUser
                    key={index}
                    message={msg.content}
                    timestamp={msg.timestamp}
                  />
                );
              }
            })}
        </div>
        <div ref={messagesEndRef} />
      </section>

      <section className="w-full px-4 mt-auto mb-6 shrink-0">
        <div className="sm:w-4/5 xl:w-3/5 sm:mx-auto w-full">
          <form className="w-full" onSubmit={handleSend}>
            <div
              className={`bg-base-700 border border-base-600 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all p-3 flex flex-col gap-2 shadow-lg ${
                loading ? "opacity-70" : ""
              }`}>
              <textarea
                className="w-full bg-transparent text-white placeholder:text-base-content/50 resize-none outline-none border-none caret-primary min-h-12 text-sm leading-relaxed"
                placeholder="Send a message..."
                rows={1}
                value={message}
                disabled={loading}
                onChange={(e) =>
                  setMessage(e.target.value.slice(0, MAX_LENGTH))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSend(e);
                  }
                }}
                maxLength={MAX_LENGTH}
              />

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-base-600">
                <span className="text-xs font-medium text-base-content/50">
                  {message.length}/{MAX_LENGTH}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    className="btn btn-ghost btn-circle btn-sm">
                    <LuMic className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="btn btn-primary bg-base-100 text-primary btn-circle btn-sm disabled:opacity-50">
                    <LuSendHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
