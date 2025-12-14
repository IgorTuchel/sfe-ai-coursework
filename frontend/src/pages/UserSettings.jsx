import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuUser,
  LuLock,
  LuShield,
  LuSave,
  LuMail,
} from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";
import { useUserSettings } from "../hooks/useUserSettings";
import MfaModel from "../components/MfaModal";
import PasswordInput from "../components/forms/PasswordInput.jsx";
import UsernameInput from "../components/forms/UsernameInput.jsx";
import { useState } from "react";
export default function UserSettingsPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [mfaHandler, setMfaHandler] = useState(null);

  const handlerSubmit = (type) => {
    if (type === "delete") {
      setMfaHandler(() => (mfaCode) => handleDelete(mfaCode));
      handleDelete();
    } else {
      setMfaHandler(() => (mfaCode) => submitChanges(mfaCode));
      submitChanges();
    }
  };

  const {
    formData,
    loading,
    showMfaModal,
    setValidPassword,
    handleInputChange,
    submitChanges,
    handleMfaCancel,
    invalidateSessions,
    handleDelete,
  } = useUserSettings(user, setUser);

  return (
    <>
      <MfaModel
        showMfaModal={showMfaModal}
        closeMfaModal={handleMfaCancel}
        loading={loading}
        onSubmit={mfaHandler}
        hidden={!showMfaModal}
      />

      <main
        className="w-full h-full overflow-y-auto bg-base-100 scrollbar-thin scrollbar-thumb-base-600 scrollbar-track-transparent"
        role="main"
        aria-label="User settings page">
        <div className="flex flex-col items-center px-4 py-6 sm:w-4/5 xl:w-3/5 sm:mx-auto w-full">
          <nav className="w-full mb-2" aria-label="Breadcrumb">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
              aria-label="Go back to dashboard">
              <LuArrowLeft className="w-6 h-6" aria-hidden="true" />
              Back to Dashboard
            </button>
          </nav>

          <header className="text-center mb-8 mt-2">
            <h1 className="text-3xl font-bold mb-2 text-white">
              User Settings
            </h1>
            <p className="text-base-content/70 text-sm">
              Manage your account preferences and security
            </p>
          </header>

          <section
            className="card w-full bg-base-700 shadow-lg border border-base-600 rounded-xl"
            aria-label="settings-form">
            <div className="card-body p-6 sm:p-8 gap-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlerSubmit();
                }}
                noValidate>
                {/* Account Information */}
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                    <LuUser
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    Account Information
                  </legend>

                  <div>
                    <label htmlFor="email" className="label">
                      <span className="label-text font-bold text-base text-white">
                        Email
                      </span>
                      <span className="label-text-alt text-base-content/50">
                        Cannot be changed
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      aria-disabled="true"
                      aria-describedby="email-hint"
                      className="input input-bordered w-full bg-base-600 border-base-600 text-base-content/50 cursor-not-allowed"
                    />
                    <span id="email-hint" className="sr-only">
                      Email address cannot be changed
                    </span>
                  </div>

                  <UsernameInput
                    value={formData.username}
                    onChange={(val) =>
                      handleInputChange({
                        target: { name: "username", value: val },
                      })
                    }
                    disabled={loading}
                  />
                </fieldset>

                <hr
                  className="divider my-0 border-base-600/50"
                  aria-hidden="true"
                />

                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                    <LuShield
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    Security
                  </legend>

                  <div className="bg-base-600/50 p-4 rounded-xl border border-base-600">
                    <label
                      htmlFor="mfa-toggle"
                      className="cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <input
                        id="mfa-toggle"
                        type="checkbox"
                        role="switch"
                        checked={formData.mfaEnabled}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "mfaEnabled",
                              value: e.target.checked,
                              type: "checkbox",
                              checked: e.target.checked,
                            },
                          })
                        }
                        disabled={loading}
                        aria-checked={formData.mfaEnabled}
                        aria-describedby="mfa-description"
                        className="toggle toggle-primary toggle-md sm:toggle-lg flex-shrink-0"
                      />
                      <div className="flex-1 w-full">
                        <div className="flex items-start gap-2 mb-1">
                          <LuMail
                            className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="font-bold text-white text-sm sm:text-base">
                            Email Multi-Factor Authentication
                          </span>
                        </div>
                        <span
                          id="mfa-description"
                          className="text-xs text-base-content/60 block pl-7 sm:pl-0">
                          {formData.mfaEnabled
                            ? "6-digit code will be required at login"
                            : "Require a 6-digit code when logging in"}
                        </span>
                      </div>
                    </label>
                    <div className="divider my-4" aria-hidden="true"></div>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={invalidateSessions}
                        className="btn btn-error btn-md w-fit rounded-xl mt-2 text-white border-base-600 hover:bg-error-900 gap-2"
                        aria-label="Invalidate other sessions">
                        <span>Invalidate Other Sessions</span>
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          handlerSubmit("delete");
                        }}
                        className="btn btn-error btn-md w-fit rounded-xl mt-2 text-white border-base-600 hover:bg-error-900 gap-2"
                        aria-label="Delete account">
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </fieldset>

                <hr
                  className="divider my-0 border-base-600/50"
                  aria-hidden="true"
                />

                {/* Change Password */}
                <fieldset className="space-y-4 my-4">
                  <legend className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                    <LuLock
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    Change Password
                  </legend>

                  <div
                    role="note"
                    className="alert bg-base-600/50 border border-base-600/50 p-3 rounded-lg text-xs">
                    <span className="text-base-content/70">
                      Leave blank to keep current password
                    </span>
                  </div>

                  <PasswordInput
                    value={formData.newPassword}
                    onChange={(val) =>
                      handleInputChange({
                        target: { name: "newPassword", value: val },
                      })
                    }
                    disabled={loading}
                    label="New Password"
                    placeholder="Enter new password"
                    showRequirements
                    onValidityChange={setValidPassword}
                    autoComplete="new-password"
                    aria-label="New Password"
                  />

                  <PasswordInput
                    value={formData.confirmPassword}
                    onChange={(val) =>
                      handleInputChange({
                        target: { name: "confirmPassword", value: val },
                      })
                    }
                    disabled={loading}
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    aria-label="Confirm New Password"
                  />
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="btn btn-primary btn-lg w-full rounded-xl shadow-lg mt-2 text-base-100 border-0 hover:brightness-110 gap-2"
                  aria-label="Save">
                  {loading ? (
                    <>
                      <span
                        className="loading loading-spinner loading-sm"
                        aria-hidden="true"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <LuSave className="w-5 h-5" aria-hidden="true" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
