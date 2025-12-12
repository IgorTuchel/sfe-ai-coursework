import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createCharacter } from "../services/createCharacterService";
import { getCharacterAdmin } from "../services/getCharacterService";
import { updateCharacter } from "../services/updateCharacterService";
import { deleteCharacter as deleteCharacterService } from "../services/deleteCharacterService";

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

export function useCharacterForm(characterId) {
  const navigate = useNavigate();
  const isEditMode = Boolean(characterId);

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

  // Load existing character in edit mode
  useEffect(() => {
    if (!isEditMode) {
      setInitialLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        setInitialLoading(true);
        const data = await getCharacterAdmin(characterId);

        if (data && data.data) {
          setFormData({
            name: data.data.name || "",
            description: data.data.description || "",
            systemPrompt: data.data.systemPrompt || "",
            firstMessage: data.data.firstMessage || "",
            isPublic: data.data.isPublic || false,
          });

          if (data.data.jsonScript && Array.isArray(data.data.jsonScript)) {
            setJsonScriptString(JSON.stringify(data.data.jsonScript, null, 2));
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
  }, [characterId, isEditMode, navigate]);

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

  const validateJsonScript = () => {
    if (!jsonScriptString) {
      toast.error("Please provide a JSON script");
      return null;
    }

    try {
      const parsed = JSON.parse(jsonScriptString);
      if (!Array.isArray(parsed)) {
        throw new Error("Json root must be an array []");
      }
      return JSON.stringify(parsed, null, 2);
    } catch (err) {
      toast.error("Invalid JSON Script: " + err.message);
      return null;
    }
  };

  const buildPayload = (validJsonString) => {
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

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validJsonString = validateJsonScript();
    if (!validJsonString) {
      setLoading(false);
      return;
    }

    const payload = buildPayload(validJsonString);
    const res = isEditMode
      ? await updateCharacter(characterId, payload)
      : await createCharacter(payload);

    if (res.success) {
      toast.success(
        `Character ${isEditMode ? "updated" : "created"} successfully!`
      );
      if (!isEditMode) {
        navigate("/dashboard/characters/edit/" + res.data._id);
        toast.success("You can now edit the character details further.");
      }
    } else {
      toast.error(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this character? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await deleteCharacterService(characterId);
      if (res.success) {
        toast.success("Character deleted successfully.");
        window.location.href = "/dashboard";
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

  return {
    formData,
    jsonScriptString,
    avatarPreview,
    themeData,
    loading,
    initialLoading,
    isEditMode,
    handleInputChange,
    handleAvatarChange,
    handleThemeChange,
    setJsonScriptString,
    handleSubmit,
    handleDelete,
  };
}
