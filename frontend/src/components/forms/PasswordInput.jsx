import { useState } from "react";
import { LuKeyRound, LuEye, LuEyeClosed } from "react-icons/lu";
import { PasswordRequirements } from "../PasswordRequirements";

export default function PasswordInput({
  value,
  onChange,
  disabled = false,
  label = "Password",
  placeholder = "••••••••",
  showRequirements = false,
  onValidityChange,
  autoComplete = "current-password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold text-primary">{label}</span>
      </label>
      <label className="input input-bordered w-full bg-base-700 rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary">
        <LuKeyRound className="h-[1em] opacity-75" aria-hidden="true" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-label={label}
          className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? (
            <LuEyeClosed className="opacity-75 h-[1em]" aria-hidden="true" />
          ) : (
            <LuEye className="opacity-75 h-[1em]" aria-hidden="true" />
          )}
        </button>
      </label>
      {showRequirements && value && (
        <PasswordRequirements
          password={value}
          setValidPassword={onValidityChange}
        />
      )}
    </div>
  );
}
