import { LuUser } from "react-icons/lu";

export default function UsernameInput({
  value,
  onChange,
  disabled = false,
  required = true,
  placeholder = "Your Username",
}) {
  return (
    <div className="form-control">
      <label htmlFor="username-input" className="label">
        <span className="label-text font-semibold text-primary">Username</span>
      </label>
      <div className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary bg-base-700">
        <LuUser className="h-[1em] opacity-75" aria-hidden="true" />
        <input
          id="username-input"
          type="text"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="Username"
          className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
        />
      </div>
    </div>
  );
}
