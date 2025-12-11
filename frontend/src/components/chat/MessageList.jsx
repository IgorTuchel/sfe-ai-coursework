import { useRef, useEffect } from "react";
import Message from "../Message"; // ← New unified component

export default function MessageList({ messages, character, theme, isLoading }) {
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if ((messages && messages.length > 0) || isLoading) {
      const delay = isInitialLoad.current ? 500 : 0;
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        isInitialLoad.current = false;
      }, delay);
    }
  }, [messages, isLoading]);

  return (
    <div className="w-full space-y-4 py-4">
      {messages &&
        character &&
        messages.map((msg, index) => (
          <Message
            key={index}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            character={character}
            theme={theme}
          />
        ))}

      {isLoading && character && (
        <div className="flex gap-3 w-full animate-pulse">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img alt={character.name} src={character.avatarUrl} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div
              className="text-sm font-semibold"
              style={{
                color:
                  theme?.systemMessageColor || theme?.primaryColor || undefined,
              }}>
              {character.name}
              <span
                className="text-xs font-normal ml-2"
                style={{
                  color: theme?.systemMessageColor
                    ? `${theme.systemMessageColor}80`
                    : "rgba(255,255,255,0.5)",
                }}>
                Thinking...
              </span>
            </div>
            <div
              className="w-fit shadow-sm rounded-lg px-4 py-3 rounded-tl-none"
              style={{
                backgroundColor: theme?.secondaryColor || "#1a1a1a",
                opacity: theme?.bubbleOpacity || 1,
                borderRadius: theme?.bubbleBorderRadius || "0.75rem",
                borderTopLeftRadius: "0px",
              }}>
              <span
                className="loading loading-dots loading-sm"
                style={{
                  color: theme?.systemMessageColor || "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
