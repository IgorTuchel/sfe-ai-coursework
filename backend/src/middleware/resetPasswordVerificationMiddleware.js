/**
 * @file resetPasswordVerificationMiddleware.js
 * @description Middleware utilities for secure password reset functionality.
 * Provides functionality to generate unique reset links, send them via email, and verify them
 * with automatic expiration and one-time use enforcement.
 * @module middleware/resetPasswordVerificationMiddleware
 */

import { v4 as uuid } from "uuid";
import { sendEmailWithResend, emailTemplates } from "../services/sendEmail.js";
import cfg from "../config/config.js";
import redisClient from "../config/redis.js";

/**
 * Creates and sends a password reset verification link to the user's email.
 *
 * @async
 * @param {string} userID - The unique identifier of the user requesting password reset.
 * @param {string} email - The user's email address to send the reset link to.
 * @returns {Promise<Object>} Result object with success status and email data or error message.
 * @returns {boolean} returns.success - Whether the reset link was created and sent successfully.
 * @returns {Object|string} returns.data - Email send response data if successful, error message if failed.
 *
 * @description Generates a UUID-based link signature, stores the user ID in Redis with a 15-minute expiration
 * (key: `resetpw_${linkSignature}`), and sends a password reset email with the generated link.
 * The reset URL is constructed from config with the signature appended.
 *
 * @example
 * const result = await makeResetPasswordVerification(
 *   "507f1f77bcf86cd799439011",
 *   "user@example.com"
 * );
 * if (result.success) {
 *   console.log("Reset link sent successfully");
 * }
 */
export async function makeResetPasswordVerification(userID, email) {
  const linkSignature = uuid().toString();
  await redisClient.setEx(`resetpw_${linkSignature}`, 15 * 60, userID); // Code valid for 15 minutes

  const { success, data } = await sendEmailWithResend(
    email,
    cfg.resendSender,
    "Your Password Reset Code for History.Ai",
    emailTemplates.resetPassword.replace(
      "{{LINK}}",
      cfg.resetPasswordURL.replace("PORT", cfg.port) + linkSignature
    )
  );

  if (!success) {
    return { success: false, data: "Failed to send reset password email." };
  }
  return { success: true, data: data };
}

/**
 * Verifies a password reset link signature and returns the associated user ID.
 *
 * @async
 * @param {string} linkSignature - The UUID signature from the password reset link.
 * @returns {Promise<Object>} Verification result object.
 * @returns {boolean} returns.valid - Whether the link signature is valid and not expired.
 * @returns {string|null} returns.userID - The user ID associated with the reset request if valid, null otherwise.
 *
 * @description Validates the reset link signature by checking if it exists in Redis and has not expired.
 * Once verified, the signature is immediately deleted from Redis to enforce one-time use and prevent replay attacks.
 * Returns invalid if the link is missing, expired (>15 minutes), or already used.
 *
 * @example
 * const result = await verifyResetPasswordLink("550e8400-e29b-41d4-a716-446655440000");
 * if (result.valid) {
 *   // Allow user to reset password
 *   console.log("Resetting password for user:", result.userID);
 * } else {
 *   // Link invalid, expired, or already used
 *   res.status(400).json({ error: "Invalid or expired reset link" });
 * }
 */
export async function verifyResetPasswordLink(linkSignature) {
  const storedUser = await redisClient.get(`resetpw_${linkSignature}`);
  if (!storedUser) {
    return { valid: false, userID: null };
  }

  await redisClient.del(`resetpw_${linkSignature}`);
  return { valid: true, userID: storedUser };
}
