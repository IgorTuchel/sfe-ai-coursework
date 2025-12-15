/**
 * @file mfaVerificationMiddleware.js
 * @description Middleware for Multi-Factor Authentication (MFA) using email verification codes.
 * Provides functionality to generate, send, verify, and handle 6-digit verification codes
 * stored in Redis with 5-minute expiration.
 * @module middleware/mfaVerificationMiddleware
 */

import cfg from "../config/config.js";
import redisClient from "../config/redis.js";
import { sendEmailWithResend, emailTemplates } from "../services/sendEmail.js";
import { HTTPCodes } from "../utils/json.js";
import Users from "../models/usersModel.js";

/**
 * Creates and sends a 6-digit verification code to the user's email.
 *
 * @async
 * @param {string} userID - The unique identifier of the user.
 * @param {string} email - The user's email address to send the code to.
 * @returns {Promise<Object>} Result object with success status and verification code or error.
 * @returns {boolean} returns.success - Whether the code was created and sent successfully.
 * @returns {string} returns.data - The generated 6-digit code if successful, error message if failed.
 *
 * @description Generates a random 6-digit numeric code, stores it in Redis with a 5-minute expiration
 * (key: `mfa_${userID}`), and sends it via email using the verification template.
 *
 * @example
 * const result = await createVerificationCode("507f1f77bcf86cd799439011", "user@example.com");
 * if (result.success) {
 *   console.log("Code sent:", result.data); // "123456"
 * }
 */
async function createVerificationCode(userID, email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.setEx(`mfa_${userID}`, 300, code); // Code valid for 5 minutes

  const { success, data } = await sendEmailWithResend(
    email,
    cfg.resendSender,
    "Your Verification Code for History.Ai",
    emailTemplates.verification.replace("{{CODE}}", code)
  );
  if (!success) {
    return { success: false, data: data };
  }
  return { success: true, data: code };
}

/**
 * Verifies a user-provided MFA code against the stored code in Redis.
 *
 * @async
 * @param {string} userID - The unique identifier of the user.
 * @param {string} code - The 6-digit verification code to verify.
 * @returns {Promise<boolean>} True if the code is valid and matches, false otherwise.
 *
 * @description Retrieves the stored code from Redis and compares it with the provided code.
 * If valid, deletes the code from Redis to prevent reuse. Returns false if code is
 * missing, expired, or doesn't match.
 *
 * @example
 * const isValid = await verifyCode("507f1f77bcf86cd799439011", "123456");
 * if (isValid) {
 *   console.log("MFA verification successful");
 * }
 */
async function verifyCode(userID, code) {
  const storedCode = await redisClient.get(`mfa_${userID}`);
  if (!storedCode) {
    return false;
  }

  if (storedCode === code) {
    await redisClient.del(`mfa_${userID}`);
    return true;
  }
  return false;
}

/**
 * Handles MFA workflow - either verifies a code or sends a new one.
 *
 * @async
 * @param {string|undefined} mfaCode - The 6-digit verification code from the user, or undefined to request a new code.
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<Object>} Result object with success status and response data.
 * @returns {boolean} returns.success - Whether the operation succeeded (true only if code verified successfully).
 * @returns {Object} returns.data - Response details.
 * @returns {number} returns.data.code - HTTP status code.
 * @returns {string} [returns.data.message] - Response message.
 * @returns {boolean} [returns.data.mfaEnabled] - User's MFA enabled status (only when verification succeeds).
 *
 * @description Orchestrates the MFA process:
 * - If mfaCode is provided: validates it's 6 digits, verifies against stored code, returns user's MFA status
 * - If mfaCode is undefined: generates and sends a new verification code to user's email
 *
 * Response scenarios:
 * - Code verified: { success: true, data: { mfaEnabled: boolean } }
 * - Code sent: { success: false, data: { code: 403, message: "Verification code sent to email." } }
 * - Invalid code: { success: false, data: { code: 400, message: "Invalid MFA code." } }
 * - User not found: { success: false, data: { code: 404, message: "User not found." } }
 *
 * @example
 * // Request new code
 * const result = await handleMFA(undefined, "507f1f77bcf86cd799439011");
 * // Returns: { success: false, data: { code: 403, message: "Verification code sent to email." } }
 *
 * @example
 * // Verify code
 * const result = await handleMFA("123456", "507f1f77bcf86cd799439011");
 * if (result.success) {
 *   console.log("MFA enabled:", result.data.mfaEnabled);
 * }
 */
export async function handleMFA(mfaCode, userID) {
  const dbUser = await Users.findById(userID);
  if (!dbUser) {
    return {
      success: false,
      data: { code: HTTPCodes.NOT_FOUND, message: "User not found." },
    };
  }

  if (mfaCode) {
    if (mfaCode.length !== 6) {
      return {
        success: false,
        data: {
          code: HTTPCodes.BAD_REQUEST,
          message: "MFA code must be 6 digits.",
        },
      };
    }
    const verified = await verifyCode(userID, mfaCode);
    if (!verified) {
      return {
        success: false,
        data: { code: HTTPCodes.BAD_REQUEST, message: "Invalid MFA code." },
      };
    }
    return {
      success: true,
      data: {
        mfaEnabled: dbUser.mfaEnabled,
      },
    };
  }
  const { success, _ } = await createVerificationCode(userID, dbUser.email);
  if (!success) {
    return {
      success: false,
      data: {
        code: HTTPCodes.BAD_REQUEST,
        message: "Failed to send verification code.",
      },
    };
  }

  return {
    success: false,
    data: {
      code: HTTPCodes.FORBIDDEN,
      message: "Verification code sent to email.",
    },
  };
}
