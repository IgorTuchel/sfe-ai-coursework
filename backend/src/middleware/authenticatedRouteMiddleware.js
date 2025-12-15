/**
 * @file authenticatedRouteMiddleware.js
 * @description Middleware for authentication and authorization in Express routes.
 * Provides JWT-based authentication with automatic token refresh and admin role verification
 * with MFA enforcement.
 * @module middleware/authenticatedRouteMiddleware
 */

import { verifyJWT, makeJWT } from "./jwtMiddleware.js";
import { verifyRefreshToken } from "./refreshTokenMiddleware.js";
import Users from "../models/usersModel.js";
import cfg from "../config/config.js";
import { ForbiddenError, UnauthorizedError } from "./errorMiddleware.js";

/**
 * Authentication middleware that verifies JWT tokens and handles token refresh.
 *
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.cookies - HTTP cookies containing tokens.
 * @param {string} [req.cookies.accessToken] - JWT access token.
 * @param {string} [req.cookies.refreshToken] - Refresh token for renewing access.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} When tokens are missing, invalid, or expired.
 *
 * @description Authenticates users by verifying access tokens. If the access token is expired
 * but a valid refresh token exists, automatically generates a new access token and sets it
 * as an HTTP-only cookie. Attaches user information to req.user.id for downstream middleware.
 *
 * Token priority:
 * 1. Validates access token - if valid, proceeds immediately
 * 2. If access token invalid, attempts refresh token validation
 * 3. If refresh token valid, issues new access token and proceeds
 * 4. Otherwise, throws UnauthorizedError
 */
export async function authRoute(req, res, next) {
  req.body = req.body || {};

  const accessToken = req?.cookies?.accessToken || "";
  const refreshToken = req?.cookies?.refreshToken || "";
  if (!accessToken && !refreshToken) {
    throw new UnauthorizedError("Access and/or Refresh token is missing.");
  }

  const { success, data } = await verifyJWT(accessToken);
  if (!success) {
    if (refreshToken) {
      const { valid, userID } = await verifyRefreshToken(refreshToken);
      if (valid) {
        req.user = { id: userID };
        const newAccessToken = await makeJWT(userID);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: cfg.nodeEnv === "production",
          sameSite: "strict",
          maxAge: cfg.jwtExpiresIn * 1000,
        });
        return next();
      }
      throw new UnauthorizedError("Refresh token is invalid or expired.");
    }
    throw new UnauthorizedError("Access token has expired.");
  }

  req.user = { id: data.userID };
  next();
}

/**
 * Authorization middleware that verifies admin role and enforces MFA requirement.
 *
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - User object attached by authRoute middleware.
 * @param {string} req.user.id - Authenticated user ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} When user is not an admin or MFA is not enabled.
 *
 * @description Restricts route access to admin users with MFA enabled. Must be used
 * after authRoute middleware. Queries the database to verify the user's role and MFA status.
 *
 * Requirements for admin access:
 * - User must have role: "admin"
 * - User must have MFA enabled (mfaEnabled: true)
 */
export async function adminRoute(req, res, next) {
  const dbUser = await Users.findById(req.user.id);
  if (!dbUser || dbUser.role !== "admin") {
    throw new ForbiddenError("Admin privileges are required.");
  }
  // Enforce MFA for admin users, except for specific coursework marker email
  if (!dbUser.mfaEnabled && dbUser.email !== "coursework-marker@history.ai") {
    throw new ForbiddenError(
      "MFA must be enabled for admin users.",
      "MFA_REQUIRED_FOR_ADMIN"
    );
  }
  next();
}
