import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import Router hooks
import {
  LuUpload,
  LuUser,
  LuFileText,
  LuMessageSquare,
  LuGlobe,
  LuLock,
  LuArrowLeft,
  LuInfo,
  LuEye,
} from "react-icons/lu";
// Import your update and get services here
import { createCharacter } from "../services/createCharacterService";
import toast from "react-hot-toast";
import CharacterCard from "../components/CharacterCard";
import { getCharacterAdmin } from "../services/getCharacterService";
import { updateCharacter } from "../services/updateCharacterService";

export default function CharacterFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // Determine mode based on ID presence

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    firstMessage: "",
    isPublic: false,
  });

  const [avatarPreview, setAvatarPreview] = useState(
    "https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/avatars/default-avatar.png"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    console.log("isEditMode:", isEditMode);
    if (isEditMode) {
      const fetchCharacter = async () => {
        try {
          setInitialLoading(true);
          const data = await getCharacterAdmin(id);
          console.log("Fetched character data:", data);
          if (data) {
            setFormData({
              name: data.data.name || "",
              description: data.data.description || "",
              systemPrompt: data.data.systemPrompt || "",
              firstMessage: data.data.firstMessage || "",
              isPublic: data.data.isPublic || false,
            });
            if (data.data.avatarUrl) {
              setAvatarPreview(data.data.avatarUrl);
            }
          }
        } catch {
          toast.error("Failed to load character details.");
          navigate("/dashboard");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCharacter();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  // --- 2. Handle Submit (Dual Logic) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let res;

    if (isEditMode) {
      // Update logic
      res = await updateCharacter(id, {
        ...formData,
        avatar: avatarFile,
      });
    } else {
      res = await createCharacter({
        ...formData,
        avatar: avatarFile,
      });
    }

    if (res.success) {
      toast.success(
        `Character ${isEditMode ? "updated" : "created"} successfully!`
      );
      if (!isEditMode) {
        navigate("/dashboard");
      }
    } else {
      toast.error(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="w-full h-full overflow-y-auto bg-base-100 scrollbar-thin scrollbar-thumb-base-600 scrollbar-track-transparent">
      <div className="flex flex-col items-center px-4 py-6 sm:w-4/5 xl:w-3/5 sm:mx-auto w-full">
        {/* Navigation */}
        <div className="w-full mb-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors w-fit">
            <LuArrowLeft className="w-6 h-6" /> Back to Admin Dashboard
          </button>
        </div>

        {/* Page Title - Dynamic Text */}
        <div className="text-center mb-8 mt-2">
          <h1 className="text-3xl font-bold mb-2 text-white">
            {isEditMode ? "Edit Character" : "Create A Character"}
          </h1>
          <p className="text-base-content/70 text-sm">
            {isEditMode
              ? "Refine the details of your historical legend"
              : "Bring a new historical legend to life"}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="card w-full bg-base-700 shadow-lg border border-base-600 rounded-xl">
          <div className="card-body p-6 sm:p-8 gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* --- Top Section: Avatar & Name --- */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {/* Fixed Image Input */}
                <div className="flex flex-col items-center gap-3">
                  <div className="avatar group cursor-pointer relative">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform group-hover:scale-105 opacity-75">
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className={`object-cover h-full w-full ${
                          loading ? "opacity-50" : ""
                        }`}
                      />

                      {/* Overlay */}
                      <label
                        htmlFor="avatar-upload"
                        className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-full ${
                          loading ? "pointer-events-none" : ""
                        }`}>
                        <LuUpload className="w-8 h-8 text-white" />
                      </label>
                    </div>
                  </div>

                  <label
                    htmlFor="avatar-upload"
                    className={`text-xs font-bold uppercase tracking-wider text-base-content/50 hover:text-primary cursor-pointer transition-colors ${
                      loading ? "opacity-50 pointer-events-none" : ""
                    }`}>
                    {isEditMode ? "Change Photo" : "Upload Photo"}
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
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
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Napoleon Bonaparte"
                      disabled={loading}
                      required
                      className="grow placeholder:text-base-content/40 bg-transparent disabled:opacity-50"
                    />
                  </label>
                </div>
              </div>

              {/* Preview Card */}
              <div
                className={`w-full bg-base-600/30 rounded-xl p-4 border border-base-600/50 mt-2 ${
                  loading ? "opacity-50" : ""
                }`}>
                <div className="flex items-center gap-2 mb-3 text-base-content/60">
                  <LuEye className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Appearance Preview
                  </span>
                </div>
                <CharacterCard
                  character={{
                    name: formData.name || "Character Name",
                    avatarUrl: avatarPreview,
                    description:
                      formData.description || "Character Description",
                  }}
                />
              </div>

              <div className="divider my-0 border-base-600/50"></div>

              {/* --- Text Areas --- */}
              <TextAreaField
                icon={LuFileText}
                label="Short Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief overview of the character..."
                disabled={loading}
                h="h-24"
              />

              <div className="form-control w-full">
                <TextAreaField
                  label="System Prompt (Personality)"
                  name="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={handleInputChange}
                  placeholder="You are Napoleon..."
                  disabled={loading}
                  h="h-40"
                  className="font-mono text-sm"
                />
                <div
                  className={`alert bg-base-600/50 border border-base-600/50 p-3 rounded-lg flex items-start text-xs sm:text-sm mt-2 ${
                    loading ? "opacity-50" : ""
                  }`}>
                  <LuInfo className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      Required Template Tags
                    </span>
                    <span className="text-base-content/70">
                      Must include:{" "}
                      <code className="font-mono text-xs p-1 rounded text-primary">
                        {"{RETRIVED_RELEVANT_DATA}"}, {"{CONVERSATION_CONTEXT}"}
                        , {"{USERNAME}"}
                      </code>
                    </span>
                  </div>
                </div>
              </div>

              <TextAreaField
                icon={LuMessageSquare}
                label="First Message"
                sub="User Greeting"
                name="firstMessage"
                value={formData.firstMessage}
                onChange={handleInputChange}
                placeholder="Greetings..."
                disabled={loading}
                h="h-24"
              />

              {/* --- Visibility Toggle --- */}
              <div
                className={`form-control bg-base-600/50 p-4 rounded-xl border border-base-600 ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}>
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="toggle toggle-primary toggle-lg"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white">
                      {formData.isPublic ? (
                        <>
                          <LuGlobe className="text-primary w-5 h-5" /> Public
                          Character
                        </>
                      ) : (
                        <>
                          <LuLock className="text-base-content/50 w-5 h-5" />
                          Private Character
                        </>
                      )}
                    </div>
                    <span className="text-xs text-base-content/60 mt-1">
                      {formData.isPublic
                        ? "Visible to all users."
                        : "Only visible to you."}
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary btn-lg w-full rounded-xl shadow-lg mt-2 text-base-100 border-0 hover:brightness-110`}
                aria-label={
                  isEditMode
                    ? "Update Character Button"
                    : "Create Character Button"
                }>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Save Changes"
                  : "Create Character"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const TextAreaField = ({
  label,
  sub,
  icon: Icon,
  h,
  disabled = false,
  className = "",
  ...props
}) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-bold text-base text-white">{label}</span>
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
