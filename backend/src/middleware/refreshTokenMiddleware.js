/**
 * @file refreshTokenMiddleware.js
 * @description Middleware utilities for creating, verifying, and managing refresh tokens.
 * Provides functionality for generating cryptographically secure refresh tokens stored in MongoDB
 * with automatic expiration and cleanup.
 * @module middleware/refreshTokenMiddleware
 */

import RefreshToken from "../models/refreshTokenModel.js";
import cfg from "../config/config.js";
import { randomBytes } from "crypto";

/**
 * Generates a new refresh token for a user and stores it in the database.
 *
 * @async
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<string>} The generated refresh token (128-character hexadecimal string).
 *
 * @description Creates a cryptographically secure 64-byte random token, converts it to hexadecimal,
 * calculates the expiration timestamp from config, and stores it in MongoDB. The token is used
 * to obtain new access tokens without requiring re-authentication.
 *
 * @example
 * const refreshToken = await makeRefreshToken("507f1f77bcf86cd799439011");
 * res.cookie("refreshToken", refreshToken, {
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: "strict"
 * });
 */
export async function makeRefreshToken(userID) {
  const expiresIn = parseInt(cfg.refreshTokenExpiresIn) * 1000; // convert to ms
  const expiresAt = new Date(Date.now() + expiresIn);
  const token = randomBytes(64).toString("hex");

  const refreshToken = new RefreshToken({
    token: token,
    userID: userID,
    expiresAt: expiresAt,
  });

  await refreshToken.save();
  return token;
}

/**
 * Verifies a refresh token and returns the associated user ID.
 *
 * @async
 * @param {string} token - The refresh token to verify.
 * @returns {Promise<Object>} Verification result object.
 * @returns {boolean} returns.valid - Whether the token is valid and not expired.
 * @returns {string|null} returns.userID - The user ID associated with the token if valid, null otherwise.
 *
 * @description Validates the refresh token by checking:
 * 1. Token exists in the database
 * 2. Token has not expired (expiresAt > current time)
 *
 * If the token is expired, it is automatically deleted from the database.
 *
 * @example
 * const result = await verifyRefreshToken(refreshToken);
 * if (result.valid) {
 *   const newAccessToken = await makeJWT(result.userID);
 * } else {
 *   // Token invalid or expired, require re-authentication
 * }
 */
export async function verifyRefreshToken(token) {
  const dbToken = await RefreshToken.findOne({ token: token });
  if (!dbToken) {
    return { valid: false, userID: null };
  }

  if (dbToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token: token });
    return { valid: false, userID: null };
  }

  return { valid: true, userID: dbToken.userID };
}

/**
 * Invalidates refresh tokens for a user, optionally excluding a specific token.
 *
 * @async
 * @param {string} userID - The unique identifier of the user.
 * @param {string} [excludeToken] - Optional token to exclude from deletion (keep active).
 * @returns {Promise<Object>} MongoDB deleteMany result object.
 *
 * @description Removes refresh tokens from the database for security purposes:
 * - If excludeToken is provided: deletes all user's tokens except the specified one
 * - If excludeToken is not provided: deletes all user's tokens (full logout)
 *
 * Use cases:
 * - Password change: invalidate all tokens except current session
 * - Full logout: invalidate all tokens across all devices
 * - Security breach: revoke all access tokens
 *
 * @example
 * // Logout from all devices
 * await invalidateOtherRefreshTokens("507f1f77bcf86cd799439011");
 *
 * @example
 * // Logout from other devices, keep current session
 * await invalidateOtherRefreshTokens("507f1f77bcf86cd799439011", currentRefreshToken);
 */
export async function invalidateOtherRefreshTokens(userID, excludeToken) {
  if (!excludeToken) {
    const success = await RefreshToken.deleteMany({ userID: userID });
    return success;
  }

  const success = await RefreshToken.deleteMany({
    userID: userID,
    token: { $ne: excludeToken },
  });
  return success;
}
