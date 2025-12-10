import { formatDistanceToNow } from "date-fns";
import { CharacterThemeContext } from "../context/CharacterThemeContext";
import { useContext } from "react";

export default function MessageSenderUser({ message, timestamp }) {
  const theme = useContext(CharacterThemeContext);

  return (
    <div className="flex gap-3 w-full justify-end">
      <div className="flex flex-col gap-1 w-full items-end">
        <div
          className="text-sm font-semibold"
          style={{ color: theme.primaryColor || "hsl(var(--p))" }}>
          You
          <span className="text-xs text-base-content/50 font-normal ml-2">
            {timestamp
              ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
              : "Just now"}
          </span>
        </div>

        <div
          className={`w-fit sm:max-w-[60%] shadow-sm text-white px-4 py-2 text-sm break-words whitespace-pre-wrap rounded-tr-none ${
            !theme.primaryColor ? "bg-primary-900 rounded-lg" : ""
          }`}
          style={{
            backgroundColor: theme.primaryColor || undefined,
            color: theme.userMessageColor || undefined,
            opacity: theme.bubbleOpacity || 1,
            borderRadius: theme.bubbleBorderRadius || "0.5rem",
            borderTopRightRadius: "0px",
            fontFamily: theme.fontFamily || undefined,
          }}>
          {message}
        </div>
      </div>
    </div>
  );
}
