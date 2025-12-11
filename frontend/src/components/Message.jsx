import { formatDistanceToNow } from "date-fns";

export default function Message({
  role,
  content,
  timestamp,
  character,
  theme,
}) {
  const isUser = role === "user";
  const senderName = isUser ? "You" : character.name;

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
          className={`w-fit sm:max-w-[60%] shadow-sm text-white px-4 py-2 text-sm break-words whitespace-pre-wrap ${
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
          }}
          role="text"
          aria-label="Message content">
          {content}
        </div>
      </div>
    </article>
  );
}
