import { LuMail } from "react-icons/lu";

export default function EmailInput({
  value,
  onChange,
  disabled = false,
  required = true,
  placeholder = "me@proton.me",
}) {
  return (
    <div className="form-control">
      <label htmlFor="email-input" className="label">
        <span className="label-text font-semibold text-primary">Email</span>
      </label>
      <div className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary bg-base-700">
        <LuMail className="h-[1em] opacity-75" aria-hidden="true" />
        <input
          id="email-input"
          type="email"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="Email address"
          className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
        />
      </div>
    </div>
  );
}
