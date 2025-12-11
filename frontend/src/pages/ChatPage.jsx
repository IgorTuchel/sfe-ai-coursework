import { LuArrowLeft } from "react-icons/lu";
import { useChatMessages } from "../hooks/useChatMessages";
import { CharacterThemeProvider } from "../context/CharacterThemeContext";
import ChatBackground from "../components/chat/ChatBackground";
import CharacterHeader from "../components/chat/CharacterHeader";
import MessageList from "../components/chat/MessageList";
import QuickReplies from "../components/chat/QuickReplies";
import ChatInput from "../components/chat/ChatInput";

export default function ChatPage() {
  const {
    chatMessages,
    character,
    quickReplies,
    chatLoading,
    loading,
    initialLoading,
    handleSendMessage,
  } = useChatMessages();

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
        <ChatBackground theme={theme} />

        <section
          className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-base-600 scrollbar-track-transparent"
          role="main"
          aria-label="Chat conversation">
          <div className="sm:w-4/5 xl:w-3/5 sm:mx-auto w-full pb-4">
            <nav className="pt-4" aria-label="Breadcrumb">
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
                aria-label="Back to Dashboard">
                <LuArrowLeft className="w-6 h-6" aria-hidden="true" />
                Back to Dashboard
              </a>
            </nav>

            <CharacterHeader character={character} theme={theme} />

            <MessageList
              messages={chatMessages}
              character={character}
              theme={theme}
              isLoading={chatLoading}
            />
          </div>
        </section>

        <section
          className="relative z-10 w-full px-4 mt-auto mb-6 shrink-0"
          role="complementary"
          aria-label="Message input area">
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
