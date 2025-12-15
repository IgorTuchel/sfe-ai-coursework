/**
 * @file jwtMiddleware.js
 * @description Middleware utilities for creating and verifying JSON Web Tokens (JWT).
 * Provides functionality for generating HS256-signed access tokens and validating them
 * with issuer and expiration checks.
 * @module middleware/jwtMiddleware
 */

import pkg from "jsonwebtoken";
import cfg from "../config/config.js";

const { sign, verify } = pkg;

/**
 * Generates a JSON Web Token (JWT) for a user.
 *
 * @async
 * @param {string} userID - The unique identifier of the user.
 * @returns {Promise<string>} Signed JWT token string.
 *
 * @description Creates an HS256-signed JWT with the following claims:
 * - iss (issuer): Application identifier from config
 * - sub (subject): User ID
 * - iat (issued at): Current timestamp in seconds
 * - exp (expiration): Current timestamp + configured expiration time in seconds
 *
 * @example
 * const token = await makeJWT("507f1f77bcf86cd799439011");
 * res.cookie("accessToken", token, { httpOnly: true });
 */
export async function makeJWT(userID) {
  const token = sign(
    {
      iss: cfg.jwtIss,
      sub: userID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + parseInt(cfg.jwtExpiresIn),
    },
    cfg.jwtSecret,
    { algorithm: "HS256" }
  );
  return token;
}

/**
 * Verifies and decodes a JSON Web Token (JWT).
 *
 * @async
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object>} Verification result object.
 * @returns {boolean} returns.success - Whether the token is valid.
 * @returns {Object} returns.data - Verification details.
 * @returns {string} returns.data.type - Result type (valid, invalid_token, invalid_issuer, expired, invalid_subject).
 * @returns {string} returns.data.message - Human-readable verification result message.
 * @returns {string} [returns.data.userID] - User ID from token subject (only present when success is true).
 *
 * @description Validates JWT tokens by checking:
 * 1. Signature validity (HS256 algorithm)
 * 2. Issuer matches configured issuer
 * 3. Token has not expired
 * 4. Subject (user ID) is present
 *
 * @example
 * const result = await verifyJWT(accessToken);
 * if (result.success) {
 *   console.log("User ID:", result.data.userID);
 * } else {
 *   console.log("Error:", result.data.type, result.data.message);
 * }
 *
 * @example
 * // Possible error responses
 * // { success: false, data: { type: "invalid_token", message: "Invalid token" } }
 * // { success: false, data: { type: "expired", message: "Token has expired" } }
 * // { success: false, data: { type: "invalid_issuer", message: "Invalid issuer" } }
 */
export async function verifyJWT(token) {
  let decoded;
  try {
    decoded = verify(token, cfg.jwtSecret, { algorithms: ["HS256"] });
  } catch (err) {
    return {
      success: false,
      data: { type: "invalid_token", message: "Invalid token" },
    };
  }
  if (decoded.iss !== cfg.jwtIss) {
    return {
      success: false,
      data: { type: "invalid_issuer", message: "Invalid issuer" },
    };
  }
  if (decoded.expresIn < Math.floor(Date.now() / 1000)) {
    return {
      success: false,
      data: { type: "expired", message: "Token has expired" },
    };
  }
  if (!decoded.sub) {
    return {
      success: false,
      data: { type: "invalid_subject", message: "Invalid subject" },
    };
  }
  return {
    success: true,
    data: { type: "valid", message: "Token is valid", userID: decoded.sub },
  };
}
