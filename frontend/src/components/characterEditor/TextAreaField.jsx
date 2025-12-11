export default function TextAreaField({
  label,
  sub,
  icon: Icon,
  h,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-bold text-base text-white">
          {label}
        </span>
        {sub && <span className="label-text-alt opacity-60">{sub}</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute top-3 left-3 w-5 h-5 opacity-50 z-10 pointer-events-none ${
              disabled ? "opacity-25" : ""
            }`}
          />
        )}
        <textarea
          className={`textarea w-full bg-base-600 border-base-600 focus:border-primary rounded-xl text-base leading-relaxed placeholder:text-base-content/40 focus:outline-none border ${h} ${
            Icon ? "pl-10" : ""
          } ${
            disabled ? "opacity-50 disabled:cursor-not-allowed" : ""
          } ${className}`}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
}
