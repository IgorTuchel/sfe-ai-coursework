import { LuCode } from "react-icons/lu";
import TextAreaField from "./TextAreaField";

export default function JsonScriptEditor({ value, onChange, disabled }) {
  return (
    <div className="w-full">
      <TextAreaField
        icon={LuCode}
        label="Logic Script (JSON)"
        sub="Define JSON Logic"
        name="jsonScript"
        value={value}
        onChange={onChange}
        placeholder=""
        disabled={disabled}
        h="h-80"
        aria-label="Character JSON Script Editor"
        className="font-mono text-xs leading-5"
      />
      <div className="text-xs text-base-content/50 mt-1 px-1">
        Use this to define deterministic logic. Must be a valid JSON array.
      </div>
    </div>
  );
}
