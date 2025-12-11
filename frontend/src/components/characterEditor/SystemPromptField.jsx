import { LuInfo } from "react-icons/lu";
import TextAreaField from "./TextAreaField";

export default function SystemPromptField({ value, onChange, disabled }) {
  return (
    <div className="form-control w-full">
      <TextAreaField
        label="System Prompt (Personality)"
        name="systemPrompt"
        value={value}
        onChange={onChange}
        placeholder="You are Napoleon..."
        disabled={disabled}
        h="h-40"
        className="font-mono text-sm"
      />
      <div
        className={`alert bg-base-600/50 border border-base-600/50 p-3 rounded-lg flex items-start text-xs sm:text-sm mt-2 ${
          disabled ? "opacity-50" : ""
        }`}>
        <LuInfo className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-white">
            Required Template Tags
          </span>
          <span className="text-base-content/70">
            Must include:{" "}
            <code className="font-mono text-xs p-1 rounded text-primary">
              {"{RETRIVED_RELEVANT_DATA}"}, {"{CONVERSATION_CONTEXT}"},{" "}
              {"{USERNAME}"}
            </code>
          </span>
        </div>
      </div>
    </div>
  );
}
