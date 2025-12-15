/**
 * @file useCharacterForm.js
 * @description Custom React hook for managing character creation and editing forms.
 * Handles form state, validation, file uploads, and CRUD operations for character management.
 * @module hooks/useCharacterForm
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createCharacter } from "../services/createCharacterService";
import { getCharacterAdmin } from "../services/getCharacterService";
import { updateCharacter } from "../services/updateCharacterService";
import { deleteCharacter as deleteCharacterService } from "../services/deleteCharacterService";

/**
 * Default avatar URL for new characters.
 * @constant {string}
 */
const DEFAULT_AVATAR =
  "https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/avatars/default-avatar.png";

/**
 * Default conversation script template for new characters.
 * @constant {Array<Object>}
 */
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

/**
 * Custom hook for managing character creation and editing forms.
 *
 * @param {string} [characterId] - Character ID for edit mode, undefined for create mode.
 * @returns {Object} Hook state and handlers.
 * @returns {Object} returns.formData - Character form data (name, description, systemPrompt, firstMessage, isPublic).
 * @returns {string} returns.jsonScriptString - JSON script as string for editing.
 * @returns {string} returns.avatarPreview - Current avatar preview URL.
 * @returns {Object} returns.themeData - Character theme configuration.
 * @returns {boolean} returns.loading - Form submission loading state.
 * @returns {boolean} returns.initialLoading - Initial data fetch loading state (edit mode only).
 * @returns {boolean} returns.isEditMode - Whether the form is in edit mode.
 * @returns {Function} returns.handleInputChange - Handler for text input changes.
 * @returns {Function} returns.handleAvatarChange - Handler for avatar file selection.
 * @returns {Function} returns.handleThemeChange - Handler for theme and background image changes.
 * @returns {Function} returns.setJsonScriptString - Setter for JSON script string.
 * @returns {Function} returns.handleSubmit - Form submission handler (create or update).
 * @returns {Function} returns.handleDelete - Character deletion handler with confirmation.
 *
 * @description Manages complete character form lifecycle:
 * - **Create mode**: Initializes with defaults (DEFAULT_AVATAR, DEFAULT_SCRIPT)
 * - **Edit mode**: Fetches existing character data and populates form
 * - Validates JSON script before submission
 * - Handles file uploads (avatar, background image)
 * - Provides toast notifications for success/error states
 * - Redirects after creation to edit mode for further customization
 *
 * @example
 * // Create mode
 * const {
 *   formData,
 *   handleInputChange,
 *   handleSubmit,
 *   loading
 * } = useCharacterForm();
 *
 * @example
 * // Edit mode
 * const {
 *   formData,
 *   initialLoading,
 *   isEditMode,
 *   handleSubmit,
 *   handleDelete
 * } = useCharacterForm("507f1f77bcf86cd799439011");
 */
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

  const [jsonScriptString, setJsonScriptString] = useState(null);

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
          if (data.data.jsonScript) {
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
      toast.error(`Error1: ${res.error}`);
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
