import { LuUpload, LuUser } from "react-icons/lu";

export default function AvatarUploadSection({
  avatarPreview,
  onAvatarChange,
  name,
  onNameChange,
  disabled,
  isEditMode,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="avatar group cursor-pointer relative">
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform group-hover:scale-105 opacity-75">
            <img
              src={avatarPreview}
              alt="Preview"
              className={`object-cover h-full w-full ${
                disabled ? "opacity-50" : ""
              }`}
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-full ${
                disabled ? "pointer-events-none" : ""
              }`}>
              <LuUpload className="w-8 h-8 text-white" />
            </label>
          </div>
        </div>
        <label
          htmlFor="avatar-upload"
          className={`text-xs font-bold uppercase tracking-wider text-base-content/50 hover:text-primary cursor-pointer transition-colors ${
            disabled ? "opacity-50 pointer-events-none" : ""
          }`}>
          {isEditMode ? "Change Photo" : "Upload Photo"}
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Name Input */}
      <div className="form-control flex-1 w-full">
        <label className="label pt-0">
          <span className="label-text font-bold text-base text-white">
            Character Name *
          </span>
        </label>
        <label className="input input-bordered outline-primary flex items-center gap-3 bg-base-600 border-base-600 focus-within:border-primary text-base-content/90 rounded-xl opacity-75">
          <LuUser className="w-5 h-5 opacity-60" />
          <input
            name="name"
            value={name}
            onChange={onNameChange}
            placeholder="e.g. Napoleon Bonaparte"
            disabled={disabled}
            required
            className="grow placeholder:text-base-content/40 bg-transparent disabled:opacity-50"
          />
        </label>
      </div>
    </div>
  );
}
