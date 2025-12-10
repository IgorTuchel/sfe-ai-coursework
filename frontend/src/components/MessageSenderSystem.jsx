import { formatDistanceToNow } from "date-fns";
import { CharacterThemeContext } from "../context/CharacterThemeContext";
import { useContext } from "react";

export default function MessageSenderSystem({ character, message, timestamp }) {
  const theme = useContext(CharacterThemeContext);

  return (
    <div className="flex gap-3 w-full">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <img alt={character.name} src={character.avatarUrl} />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div
          className="text-sm font-semibold"
          style={{ color: theme.primaryColor || "hsl(var(--p))" }}>
          {character.name}
          <span className="text-xs text-base-content/50 font-normal ml-2">
            {timestamp
              ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
              : ""}
          </span>
        </div>

        <div
          className={`w-fit sm:max-w-[60%] shadow-sm text-white px-4 py-2 text-sm break-words whitespace-pre-wrap rounded-tl-none ${
            !theme.secondaryColor ? "bg-base-500 rounded-lg" : ""
          }`}
          style={{
            backgroundColor: theme.secondaryColor || undefined,
            color: theme.systemMessageColor || undefined,
            opacity: theme.bubbleOpacity || 1,
            borderRadius: theme.bubbleBorderRadius || "0.5rem",
            borderTopLeftRadius: "0px",
            fontFamily: theme.fontFamily || undefined,
          }}>
          {message}
        </div>
      </div>
    </div>
  );
}
