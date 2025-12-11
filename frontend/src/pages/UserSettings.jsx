import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuUser,
  LuLock,
  LuShield,
  LuSave,
  LuMail,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { updateUserSettings } from "../services/updateUserSettingsService";
import MfaModel from "../components/MfaModal";
import { PasswordRequirements } from "../components/PasswordRequirements";

export default function UserSettingsPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    newPassword: "",
    confirmPassword: "",
    mfaEnabled: user?.mfaEnabled || false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitChanges = async (mfaCode = "") => {
    setLoading(true);

    if (formData.newPassword) {
      if (!validPassword) {
        toast.error("Password must meet all requirements");
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        setLoading(false);
        return;
      }
    }

    const payload = { mfaCode };
    if (formData.mfaEnabled !== user?.mfaEnabled) payload.mfaEnabled = true;
    if (formData.username !== user?.username) {
      if (formData.username.length < 3) {
        toast.error("Username must be at least 3 characters");
        setLoading(false);
        return;
      }
      payload.username = formData.username;
    }
    if (formData.newPassword) payload.password = formData.newPassword;

    if (!payload.mfaEnabled && !payload.username && !payload.password) {
      toast.error("No changes to save");
      setLoading(false);
      return;
    }

    const res = await updateUserSettings(payload);

    if (res.mfaRequired) {
      toast.success("MFA code sent to your email");
      setShowMfaModal(true);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success("Settings updated successfully!");
      setUser({
        ...user,
        username: res.data.username,
        mfaEnabled: res.data.mfaEnabled,
      });
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
        mfaEnabled: res.data.mfaEnabled,
      }));
      setShowMfaModal(false);
    } else {
      toast.error(`Error: ${res.error || "Failed to update settings"}`);
      setFormData((prev) => ({ ...prev, mfaEnabled: user?.mfaEnabled }));
    }
    setLoading(false);
  };

  const handleMfaCancel = () => {
    setShowMfaModal(false);
    setLoading(false);
    setFormData((prev) => ({
      ...prev,
      mfaEnabled: user?.mfaEnabled,
      newPassword: "",
      confirmPassword: "",
    }));
    toast.info("Changes cancelled");
  };

  return (
    <>
      <MfaModel
        showMfaModal={showMfaModal}
        closeMfaModal={handleMfaCancel}
        loading={loading}
        onSubmit={submitChanges}
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
                  submitChanges("");
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

                  <div>
                    <label htmlFor="username" className="label">
                      <span className="label-text font-bold text-base text-white">
                        Username
                      </span>
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      minLength={3}
                      aria-required="true"
                      aria-invalid={
                        formData.username.length > 0 &&
                        formData.username.length < 3
                      }
                      className="input input-bordered w-full bg-base-600 border-base-600 focus:border-primary text-base-content/90"
                    />
                  </div>
                </fieldset>

                <hr
                  className="divider my-0 border-base-600/50"
                  aria-hidden="true"
                />

                {/* Security */}
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
                          setFormData((prev) => ({
                            ...prev,
                            mfaEnabled: e.target.checked,
                          }))
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
                  </div>
                </fieldset>

                <hr
                  className="divider my-0 border-base-600/50"
                  aria-hidden="true"
                />

                {/* Change Password */}
                <fieldset className="space-y-4">
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

                  <div>
                    <label htmlFor="new-password" className="label">
                      <span className="label-text font-bold text-base text-white">
                        New Password
                      </span>
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      aria-describedby={
                        formData.newPassword
                          ? "password-requirements"
                          : undefined
                      }
                      className="input input-bordered w-full bg-base-600 border-base-600 focus:border-primary text-base-content/90 placeholder:text-base-content/40"
                    />
                  </div>

                  {formData.newPassword && (
                    <div id="password-requirements" aria-live="polite">
                      <PasswordRequirements
                        password={formData.newPassword}
                        setValidPassword={setValidPassword}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="confirm-password" className="label">
                      <span className="label-text font-bold text-base text-white">
                        Confirm New Password
                      </span>
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      aria-invalid={
                        formData.confirmPassword &&
                        formData.newPassword !== formData.confirmPassword
                      }
                      className="input input-bordered w-full bg-base-600 border-base-600 focus:border-primary text-base-content/90 placeholder:text-base-content/40"
                    />
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="btn btn-primary btn-lg w-full rounded-xl shadow-lg mt-2 text-base-100 border-0 hover:brightness-110 gap-2">
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
