import { formatDistanceToNow } from "date-fns";
import { parseMessageContent } from "../utils/messageParser";

export default function Message({
  role,
  content,
  timestamp,
  character,
  theme,
}) {
  const isUser = role === "user";
  const senderName = isUser ? "You" : character.name;

  const messageParts = parseMessageContent(content);

  return (
    <article
      className={`flex gap-3 w-full ${isUser ? "justify-end" : ""}`}
      aria-label={`Message from ${senderName}`}>
      {!isUser && (
        <div
          className="avatar"
          role="img"
          aria-label={`${character.name}'s avatar`}>
          <div className="w-10 h-10 rounded-full">
            <img alt={character.name} src={character.avatarUrl} />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col gap-1 w-full ${isUser ? "items-end" : ""}`}>
        <header
          className="text-sm font-semibold"
          style={{ color: theme.primaryColor || "hsl(var(--p))" }}>
          <span aria-label="Message sender">{senderName}</span>
          {timestamp && (
            <time
              className="text-xs text-base-content/50 font-normal ml-2"
              dateTime={new Date(timestamp).toISOString()}
              aria-label={`Sent ${formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
              })}`}>
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </time>
          )}
          {!timestamp && isUser && (
            <span className="text-xs text-base-content/50 font-normal ml-2">
              Just now
            </span>
          )}
        </header>

        <div
          className={`flex flex-col gap-2 w-fit sm:max-w-[80%] shadow-sm px-4 py-2 text-sm ${
            isUser ? "rounded-tr-none" : "rounded-tl-none"
          } ${
            !theme[isUser ? "primaryColor" : "secondaryColor"]
              ? `bg-${isUser ? "primary-900" : "base-500"} rounded-lg`
              : ""
          }`}
          style={{
            backgroundColor:
              theme[isUser ? "primaryColor" : "secondaryColor"] || undefined,
            color:
              theme[isUser ? "userMessageColor" : "systemMessageColor"] ||
              undefined,
            opacity: theme.bubbleOpacity || 1,
            borderRadius: theme.bubbleBorderRadius || "0.5rem",
            [isUser ? "borderTopRightRadius" : "borderTopLeftRadius"]: "0px",
            fontFamily: theme.fontFamily || undefined,
          }}>
          {/* ✅ Render each part */}
          {messageParts.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        </div>
      </div>
    </article>
  );
}

function MessagePart({ part }) {
  if (part.type === "text") {
    return (
      <span className="break-words whitespace-pre-wrap">{part.content}</span>
    );
  }

  if (part.type === "image") {
    return (
      <img
        src={part.content}
        alt="Shared image"
        className="rounded-lg max-w-auto md:max-w-[400px] h-auto"
        loading="lazy"
      />
    );
  }

  if (part.type === "embed") {
    return (
      <iframe
        src={part.content}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
        title="Embedded content"></iframe>
    );
  }

  return null;
}
