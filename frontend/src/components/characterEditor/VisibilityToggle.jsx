import { LuGlobe, LuLock } from "react-icons/lu";

export default function VisibilityToggle({ isPublic, onChange, disabled }) {
  return (
    <div
      className={`form-control bg-base-600/50 p-4 rounded-xl border border-base-600 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}>
      <label className="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          name="isPublic"
          checked={isPublic}
          onChange={onChange}
          disabled={disabled}
          className="toggle toggle-primary toggle-lg"
        />
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            {isPublic ? (
              <>
                <LuGlobe className="text-primary w-5 h-5" /> Public Character
              </>
            ) : (
              <>
                <LuLock className="text-base-content/50 w-5 h-5" /> Private
                Character
              </>
            )}
          </div>
          <span className="text-xs text-base-content/60 mt-1">
            {isPublic ? "Visible to all users." : "Only visible to you."}
          </span>
        </div>
      </label>
    </div>
  );
}
