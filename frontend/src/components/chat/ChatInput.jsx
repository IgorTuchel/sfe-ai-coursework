import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";

const MAX_LENGTH = 512;

export default function ChatInput({ onSend, disabled, theme }) {
  const [message, setMessage] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div
        className={`transition-all p-3 flex flex-col gap-2 shadow-lg border rounded-xl ${
          !theme?.inputBackgroundColor ? "bg-base-700 border-base-600" : ""
        }`}
        style={{
          backgroundColor: theme?.inputBackgroundColor || undefined,
          borderColor: isInputFocused
            ? theme?.primaryColor || "var(--theme-primary)"
            : theme?.inputBorderColor || "transparent",
          borderRadius: theme?.bubbleBorderRadius || "0.75rem",
        }}>
        <textarea
          className="w-full bg-transparent resize-none outline-none border-none caret-primary min-h-12 text-sm leading-relaxed"
          style={{
            color: theme?.inputTextColor || "#ffffff",
            caretColor: theme?.sendButtonColor || undefined,
          }}
          placeholder={disabled ? "Waiting for reply..." : "Send a message..."}
          rows={1}
          value={message}
          disabled={disabled}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
          }}
          maxLength={MAX_LENGTH}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />

        <div
          className="flex items-center justify-between gap-3 pt-2 border-t"
          style={{
            borderColor: theme?.inputBorderColor || "rgba(255,255,255,0.1)",
          }}>
          <span
            className="text-xs font-medium opacity-50"
            style={{ color: theme?.inputTextColor }}>
            {message.length}/{MAX_LENGTH}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={disabled || !message.trim()}
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
  );
}
