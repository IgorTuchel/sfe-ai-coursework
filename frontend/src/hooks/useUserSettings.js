/**
 * @file useUserSettings.js
 * @description Custom React hook for managing user account settings and security operations.
 * Handles username updates, password changes, MFA toggling, session invalidation, and account deletion
 * with validation and MFA verification flow.
 * @module hooks/useUserSettings
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { updateUserSettings } from "../services/updateUserSettingsService";
import { invalidateOtherRefreshTokens } from "../services/invalidateOtherSessions";
import { deleteUser } from "../services/deleteUserService";

/**
 * Custom hook for managing user settings and account operations.
 *
 * @param {Object} user - Current user object from context.
 * @param {string} user.username - Current username.
 * @param {boolean} user.mfaEnabled - Current MFA status.
 * @param {Function} setUser - Setter function to update user context.
 * @returns {Object} Hook state and handlers.
 * @returns {Object} returns.formData - Form data (username, newPassword, confirmPassword, mfaEnabled).
 * @returns {boolean} returns.loading - Loading state for operations.
 * @returns {boolean} returns.showMfaModal - Whether MFA modal should be displayed.
 * @returns {boolean} returns.validPassword - Password validation status (from external validator).
 * @returns {Function} returns.setValidPassword - Setter for password validation status.
 * @returns {Function} returns.handleInputChange - Handler for form input changes.
 * @returns {Function} returns.submitChanges - Submits settings changes with optional MFA code.
 * @returns {Function} returns.handleMfaCancel - Cancels MFA flow and reverts changes.
 * @returns {Function} returns.invalidateSessions - Logs out all other user sessions.
 * @returns {Function} returns.handleDelete - Deletes user account with MFA verification.
 *
 * @description Manages complete user settings workflow:
 * - **Username changes**: Validates minimum 3 characters
 * - **Password changes**: Validates password strength and confirmation match
 * - **MFA toggling**: Requires email verification before enabling/disabling
 * - **Session management**: Allows invalidating other refresh tokens
 * - **Account deletion**: Requires MFA code for security
 * - Handles two-phase MFA flow (request code → verify code)
 * - Reverts form state on MFA cancellation
 *
 * @example
 * const {
 *   formData,
 *   loading,
 *   showMfaModal,
 *   handleInputChange,
 *   submitChanges,
 *   handleMfaCancel,
 *   invalidateSessions
 * } = useUserSettings(user, setUser);
 *
 * return (
 *   <>
 *     <SettingsForm data={formData} onChange={handleInputChange} onSubmit={submitChanges} />
 *     {showMfaModal && <MfaModal onSubmit={submitChanges} onCancel={handleMfaCancel} />}
 *   </>
 * );
 *
 * @example
 * // Account deletion with MFA
 * const handleDeleteClick = async () => {
 *   const result = await handleDelete();
 *   if (result.mfaRequired) {
 *     // MFA modal shown automatically
 *   }
 * };
 */
export function useUserSettings(user, setUser) {
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

  const invalidateSessions = async () => {
    const res = await invalidateOtherRefreshTokens();
    if (res.success) {
      toast.success(res.message || "Other sessions invalidated.");
    } else {
      toast.error(res.message || "Failed to invalidate other sessions.");
    }
  };

  const validateChanges = () => {
    if (formData.newPassword) {
      if (!validPassword) {
        toast.error("Password must meet all requirements");
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return false;
      }
    }

    if (formData.username !== user?.username && formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }

    return true;
  };

  const buildPayload = (mfaCode) => {
    const payload = { mfaCode };
    if (formData.mfaEnabled !== user?.mfaEnabled) payload.mfaEnabled = true;
    if (formData.username !== user?.username)
      payload.username = formData.username;
    if (formData.newPassword) payload.password = formData.newPassword;
    return payload;
  };

  const submitChanges = async (mfaCode = "") => {
    setLoading(true);

    if (!validateChanges()) {
      setLoading(false);
      return;
    }

    const payload = buildPayload(mfaCode);

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
    toast.error("Changes cancelled");
  };

  const handleDelete = async (mfaCode = "") => {
    setLoading(true);
    const res = await deleteUser(mfaCode);
    if (res.mfaRequired) {
      toast.success("MFA code sent to your email");
      setShowMfaModal(true);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success("Account deleted successfully.");
      setUser(null);
      window.location.replace("/");
    } else {
      toast.error(`Error: ${res.error || "Failed to delete account"}`);
    }
    setLoading(false);
    return res;
  };

  return {
    formData,
    loading,
    showMfaModal,
    validPassword,
    setValidPassword,
    handleInputChange,
    submitChanges,
    handleMfaCancel,
    invalidateSessions,
    handleDelete,
  };
}
