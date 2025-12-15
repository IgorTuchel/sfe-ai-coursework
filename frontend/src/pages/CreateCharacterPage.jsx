import { useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuFileText,
  LuMessageSquare,
  LuTrash2,
} from "react-icons/lu";
import TextAreaField from "../components/characterEditor/TextAreaField";
import VisibilityToggle from "../components/characterEditor/VisibilityToggle";
import VectorStoreManager from "../components/VectorStoreManager";
import AvatarUploadSection from "../components/characterEditor/AvatarUploadSection";
import SystemPromptField from "../components/characterEditor/SystemPromptField";
import JsonScriptEditor from "../components/characterEditor/JsonScriptEditor";
import ThemeEditor from "../components/characterEditor/ThemeEditor";
import { useCharacterForm } from "../hooks/useCharacterForm";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CharacterFormPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const {
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
  } = useCharacterForm(id);

  if (initialLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-center max-w-md">
          You do not have permission to access this page. Please contact an
          administrator if you believe this is an error.
        </p>
        <a
          href="/dashboard"
          className="mt-6 btn btn-primary rounded-xl shadow-lg text-base-100 border-0 hover:bg-primary-600">
          Back to Dashboard
        </a>
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
            <LuArrowLeft className="w-6 h-6" /> Back to Dashboard
          </a>
          {isEditMode && (
            <button
              onClick={handleDelete}
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
                aria-label="Character Avatar and Name Section"
                isEditMode={isEditMode}
              />

              <div className="divider my-0 border-base-600/50"></div>

              <TextAreaField
                icon={LuFileText}
                label="Short Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                aria-label="Character Description Field"
                placeholder="A brief overview of the character..."
                disabled={loading}
                h="h-24"
              />

              <SystemPromptField
                value={formData.systemPrompt}
                onChange={handleInputChange}
                aria-label="Character System Prompt Field"
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
                aria-label="Character First Message Field"
                h="h-24"
              />

              <JsonScriptEditor
                value={jsonScriptString}
                onChange={(e) => setJsonScriptString(e.target.value)}
                aria-label="Character Script Editor"
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
