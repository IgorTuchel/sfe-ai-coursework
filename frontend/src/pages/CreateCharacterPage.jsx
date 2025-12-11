import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuFileText,
  LuMessageSquare,
  LuTrash2,
} from "react-icons/lu";
import toast from "react-hot-toast";

import { createCharacter } from "../services/createCharacterService";
import { getCharacterAdmin } from "../services/getCharacterService";
import { updateCharacter } from "../services/updateCharacterService";
import { deleteCharacter as deleteCharacterService } from "../services/deleteCharacterService"; // ADD THIS IMPORT
import TextAreaField from "../components/characterEditor/TextAreaField";
import VisibilityToggle from "../components/characterEditor/VisibilityToggle";
import VectorStoreManager from "../components/VectorStoreManager";
import AvatarUploadSection from "../components/characterEditor/AvatarUploadSection";
import SystemPromptField from "../components/characterEditor/SystemPromptField";
import JsonScriptEditor from "../components/characterEditor/JsonScriptEditor";
import ThemeEditor from "../components/characterEditor/ThemeEditor";

const DEFAULT_AVATAR =
  "https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/avatars/default-avatar.png";

const DEFAULT_SCRIPT = [
  {
    triggers: ["hi", "hello", "hey", "greetings"],
    responses: [
      {
        text: "Hello! How can I assist you today?",
        type: "text",
        probability: 1.0,
      },
    ],
    options: [
      { text: "how are you", nextNode: "how are you" },
      { text: "who are you", nextNode: "who are you" },
    ],
  },
];

export default function CharacterFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    firstMessage: "",
    isPublic: false,
  });

  const [jsonScriptString, setJsonScriptString] = useState(
    JSON.stringify(DEFAULT_SCRIPT, null, 2)
  );

  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);

  const [themeData, setThemeData] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchCharacter = async () => {
        try {
          setInitialLoading(true);
          const data = await getCharacterAdmin(id);

          if (data && data.data) {
            setFormData({
              name: data.data.name || "",
              description: data.data.description || "",
              systemPrompt: data.data.systemPrompt || "",
              firstMessage: data.data.firstMessage || "",
              isPublic: data.data.isPublic || false,
            });

            if (data.data.jsonScript && Array.isArray(data.data.jsonScript)) {
              setJsonScriptString(
                JSON.stringify(data.data.jsonScript, null, 2)
              );
            } else {
              setJsonScriptString(JSON.stringify(DEFAULT_SCRIPT, null, 2));
            }

            if (data.data.theme) {
              setThemeData(data.data.theme);
            }

            if (data.data.avatarUrl) {
              setAvatarPreview(data.data.avatarUrl);
            }
          }
        } catch (error) {
          console.error("Load error:", error);
          toast.error("Failed to load character details.");
          navigate("/dashboard");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCharacter();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (file) => {
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleThemeChange = (updatedTheme, bgFile) => {
    setThemeData(updatedTheme);
    setBackgroundImageFile(bgFile);
  };

  // FIXED: Delete handler
  const handleDeleteCharacter = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this character? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await deleteCharacterService(id);
      window.location.href = "/dashboard"; // Navigate doesnt work for some reason
      if (res.success) {
        toast.success("Character deleted successfully.");
      } else {
        toast.error(
          "Error deleting character: " + (res.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete character");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!jsonScriptString) {
      toast.error("Please provide a JSON script");
      setLoading(false);
      return;
    }

    let validJsonString = jsonScriptString;
    try {
      const parsed = JSON.parse(jsonScriptString);
      if (!Array.isArray(parsed)) {
        throw new Error("Json root must be an array []");
      }
      validJsonString = JSON.stringify(parsed, null, 2);
    } catch (err) {
      toast.error("Invalid JSON Script: " + err.message);
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      jsonScript: validJsonString,
      avatar: avatarFile,
    };

    if (isEditMode && themeData) {
      payload.theme = JSON.stringify(themeData);
      if (backgroundImageFile) {
        payload.backgroundImage = backgroundImageFile;
      }
    }

    const res = isEditMode
      ? await updateCharacter(id, payload)
      : await createCharacter(payload);

    if (res.success) {
      toast.success(
        `Character ${isEditMode ? "updated" : "created"} successfully!`
      );
      if (!isEditMode) {
        navigate("/dashboard/characters/create/" + res.data._id);
        toast.success("You can now edit the character details further.");
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
        <div className="w-full mb-2 flex items-center justify-between">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors">
            <LuArrowLeft className="w-6 h-6" /> Back to Admin Dashboard
          </a>
          {/* MOVED: Delete button to top right */}
          {isEditMode && (
            <button
              onClick={handleDeleteCharacter}
              disabled={loading}
              className="btn btn-error btn-sm gap-2"
              aria-label="Delete Character Button">
              <LuTrash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>

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

        <div className="card w-full bg-base-700 shadow-lg border border-base-600 rounded-xl">
          <div className="card-body p-6 sm:p-8 gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <AvatarUploadSection
                avatarPreview={avatarPreview}
                onAvatarChange={handleAvatarChange}
                name={formData.name}
                onNameChange={handleInputChange}
                disabled={loading}
                isEditMode={isEditMode}
              />

              <div className="divider my-0 border-base-600/50"></div>

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

              <SystemPromptField
                value={formData.systemPrompt}
                onChange={handleInputChange}
                disabled={loading}
              />

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

              <JsonScriptEditor
                value={jsonScriptString}
                onChange={(e) => setJsonScriptString(e.target.value)}
                disabled={loading}
              />

              <VisibilityToggle
                isPublic={formData.isPublic}
                onChange={handleInputChange}
                disabled={loading}
              />

              {isEditMode && (
                <>
                  <div className="divider my-0 border-base-600/50"></div>
                  <ThemeEditor
                    initialTheme={themeData || {}}
                    onThemeChange={handleThemeChange}
                    disabled={loading}
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full rounded-xl shadow-lg mt-2 text-base-100 border-0 hover:brightness-110"
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

        {isEditMode && <VectorStoreManager characterId={id} />}
      </div>
    </section>
  );
}
