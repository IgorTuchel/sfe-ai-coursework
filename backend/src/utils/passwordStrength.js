/**
 * @file passwordStrength.js
 * @description Simple password strength checker with basic policy rules.
 * @module utils/passwordStrength
 */

/**
 * Evaluates whether a password meets minimum strength requirements.
 * Checks length, upper/lowercase letters, digits, and special characters.
 * @function evaulatePassword
 * @param {string} password - Password to validate.
 * @returns {{valid: boolean, reason: string}} Result object with validity and human-readable reason.
 */
export function evaulatePassword(password) {
  if (password.length < 8) {
    return {
      valid: false,
      reason: "Password must be at least 8 characters long.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one lowercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one digit.",
    };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one special character.",
    };
  }
  return { valid: true, reason: "Password meets the criteria." };
}
