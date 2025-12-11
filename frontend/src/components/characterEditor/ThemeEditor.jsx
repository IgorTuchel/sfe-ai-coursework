import { useState, useEffect, useCallback } from "react";
import {
  LuPalette,
  LuType,
  LuImage,
  LuMessageSquare,
  LuSend,
  LuUpload,
} from "react-icons/lu";

export default function ThemeEditor({
  initialTheme = {},
  onThemeChange,
  disabled = false,
}) {
  const [theme, setTheme] = useState({
    backgroundColor: initialTheme.backgroundColor || "",
    fontFamily: initialTheme.fontFamily || "",
    backgroundImageUrl: initialTheme.backgroundImageUrl || "",
    backgroundOverlayOpacity: initialTheme.backgroundOverlayOpacity ?? 0.5,
    primaryColor: initialTheme.primaryColor || "",
    userMessageColor: initialTheme.userMessageColor || "",
    secondaryColor: initialTheme.secondaryColor || "",
    systemMessageColor: initialTheme.systemMessageColor || "",
    bubbleOpacity: initialTheme.bubbleOpacity ?? 1,
    bubbleBorderRadius: initialTheme.bubbleBorderRadius || "",
    inputBackgroundColor: initialTheme.inputBackgroundColor || "",
    inputTextColor: initialTheme.inputTextColor || "",
    inputBorderColor: initialTheme.inputBorderColor || "",
    sendButtonColor: initialTheme.sendButtonColor || "",
  });

  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(
    initialTheme.backgroundImageUrl || ""
  );

  // Memoize to prevent infinite loops
  const notifyParent = useCallback(() => {
    if (onThemeChange) {
      const changedTheme = {};
      Object.keys(theme).forEach((key) => {
        if (theme[key] !== "" && theme[key] !== undefined) {
          changedTheme[key] = theme[key];
        }
      });
      onThemeChange(changedTheme, backgroundImageFile);
    }
  }, [theme, backgroundImageFile, onThemeChange]);

  useEffect(() => {
    notifyParent();
  }, [notifyParent]);

  const handleChange = (field, value) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundPreview(URL.createObjectURL(file));
      setBackgroundImageFile(file);
    }
  };

  return (
    <div className="card w-full bg-base-700 shadow-lg border border-base-600 rounded-xl mt-6">
      <div className="card-body p-6 sm:p-8 gap-6">
        <div className="flex items-center gap-3 mb-2">
          <LuPalette className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Theme Customization
            </h2>
            <p className="text-xs text-base-content/70 mt-1">
              Customize the visual appearance of this character's chat interface
            </p>
          </div>
        </div>

        <div className="divider my-0 border-base-600/50"></div>

        {/* Background Settings */}
        <div className="space-y-4">
          <SectionHeader icon={LuImage} title="Background" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorInput
              label="Background Color"
              value={theme.backgroundColor}
              onChange={(val) => handleChange("backgroundColor", val)}
              disabled={disabled}
            />

            <NumberInput
              label="Background Overlay Opacity"
              value={theme.backgroundOverlayOpacity}
              onChange={(val) => handleChange("backgroundOverlayOpacity", val)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
            />
          </div>

          {/* Background Image Upload */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-white text-sm">
                Background Image
              </span>
            </label>
            <div className="flex gap-3 items-center">
              {backgroundPreview && (
                <div className="avatar">
                  <div className="w-16 h-16 rounded-lg ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={backgroundPreview}
                      alt="Background preview"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <label
                htmlFor="background-upload"
                className={`btn btn-outline btn-primary rounded-lg flex-1 ${
                  disabled ? "opacity-50 pointer-events-none" : ""
                }`}>
                <LuUpload className="w-4 h-4" />
                {backgroundPreview ? "Change Image" : "Upload Image"}
              </label>
              <input
                id="background-upload"
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                disabled={disabled}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="divider my-0 border-base-600/50"></div>

        {/* Color Scheme */}
        <div className="space-y-4">
          <SectionHeader icon={LuPalette} title="Color Scheme" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorInput
              label="Primary Color"
              value={theme.primaryColor}
              onChange={(val) => handleChange("primaryColor", val)}
              disabled={disabled}
            />
            <ColorInput
              label="Secondary Color"
              value={theme.secondaryColor}
              onChange={(val) => handleChange("secondaryColor", val)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="divider my-0 border-base-600/50"></div>

        {/* Message Bubbles */}
        <div className="space-y-4">
          <SectionHeader icon={LuMessageSquare} title="Message Bubbles" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorInput
              label="User Message Color"
              value={theme.userMessageColor}
              onChange={(val) => handleChange("userMessageColor", val)}
              disabled={disabled}
            />
            <ColorInput
              label="System Message Color"
              value={theme.systemMessageColor}
              onChange={(val) => handleChange("systemMessageColor", val)}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Bubble Opacity"
              value={theme.bubbleOpacity}
              onChange={(val) => handleChange("bubbleOpacity", val)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
            />

            <TextInput
              label="Border Radius"
              value={theme.bubbleBorderRadius}
              onChange={(val) => handleChange("bubbleBorderRadius", val)}
              placeholder="e.g. 12px, 1rem"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="divider my-0 border-base-600/50"></div>

        {/* Input Area */}
        <div className="space-y-4">
          <SectionHeader icon={LuSend} title="Input Area" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorInput
              label="Input Background"
              value={theme.inputBackgroundColor}
              onChange={(val) => handleChange("inputBackgroundColor", val)}
              disabled={disabled}
            />
            <ColorInput
              label="Input Text Color"
              value={theme.inputTextColor}
              onChange={(val) => handleChange("inputTextColor", val)}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorInput
              label="Input Border Color"
              value={theme.inputBorderColor}
              onChange={(val) => handleChange("inputBorderColor", val)}
              disabled={disabled}
            />
            <ColorInput
              label="Send Button Color"
              value={theme.sendButtonColor}
              onChange={(val) => handleChange("sendButtonColor", val)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="divider my-0 border-base-600/50"></div>

        {/* Typography */}
        <div className="space-y-4">
          <SectionHeader icon={LuType} title="Typography" />

          <TextInput
            label="Font Family"
            value={theme.fontFamily}
            onChange={(val) => handleChange("fontFamily", val)}
            placeholder="e.g. 'Inter', sans-serif"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

// ===== Helper Components =====

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 text-white">
    <Icon className="w-5 h-5 text-primary" />
    <h3 className="font-bold text-lg">{title}</h3>
  </div>
);

const ColorInput = ({ label, value, onChange, disabled }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold text-white text-sm">
        {label}
      </span>
    </label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-14 h-11 rounded-lg cursor-pointer border-2 border-base-600 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        disabled={disabled}
        className={`input input-bordered flex-1 bg-base-600 border-base-600 focus:border-primary rounded-lg text-base-content/90 placeholder:text-base-content/40 font-mono text-sm ${
          disabled ? "opacity-50" : ""
        }`}
      />
    </div>
  </div>
);

const NumberInput = ({ label, value, onChange, disabled, min, max, step }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold text-white text-sm">
        {label}
      </span>
    </label>
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
      className={`input input-bordered w-full bg-base-600 border-base-600 focus:border-primary rounded-lg text-base-content/90 ${
        disabled ? "opacity-50" : ""
      }`}
    />
  </div>
);

const TextInput = ({ label, value, onChange, placeholder, disabled }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold text-white text-sm">
        {label}
      </span>
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`input input-bordered w-full bg-base-600 border-base-600 focus:border-primary rounded-lg text-base-content/90 placeholder:text-base-content/40 ${
        disabled ? "opacity-50" : ""
      }`}
    />
  </div>
);
