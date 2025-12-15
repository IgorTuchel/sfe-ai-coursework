/**
 * @file handlerUpdateUser.js
 * @description Handler for updating user information.
 * Validates input data, handles MFA changes, password updates, and username changes.
 * @module handlers/handlerUpdateUser
 */

import { respondWithJson, HTTPCodes } from "../utils/json.js";
import { evaulatePassword } from "../utils/passwordStrength.js";
import { hashPassword } from "../utils/hashedPass.js";
import Users from "../models/usersModel.js";
import { handleMFA } from "../middleware/mfaVerificationMiddleware.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../middleware/errorMiddleware.js";
import { sanitiseInputText } from "../utils/inputSantise.js";

export async function handlerUpdateUser(req, res) {
  const { password, mfaEnabled, username, mfaCode } = req.body;
  let userID = req.user.id;
  if (!password && !mfaEnabled && !username) {
    throw new BadRequestError(
      "A change is required but no changes were provided."
    );
  }

  const changes = {};

  if (mfaEnabled) {
    const { success, data } = await handleMFA(mfaCode, userID);
    if (!success) {
      if (data.code === HTTPCodes.FORBIDDEN) {
        throw new ForbiddenError(data.message, "MFA_REQUIRED");
      } else if (data.code === HTTPCodes.NOT_FOUND) {
        throw new NotFoundError(data.message);
      } else {
        throw new BadRequestError(data.message);
      }
    }
    changes.mfaEnabled = !data.mfaEnabled;
  }
  if (username) {
    const cleanUsername = sanitiseInputText(username);
    if (cleanUsername.length < 3) {
      throw new BadRequestError("Username must be at least 3 characters long.");
    }
    changes.username = cleanUsername;
  }

  if (password) {
    const cleanPassword = sanitiseInputText(password);
    const { valid, reason } = evaulatePassword(cleanPassword);
    if (!valid) {
      throw new BadRequestError(reason);
    }
    changes.passwordHash = await hashPassword(cleanPassword);
  }

  const updatedUser = await Users.findByIdAndUpdate(userID, changes, {
    new: true,
  }).select("-passwordHash");

  if (!updatedUser) {
    throw new BadRequestError("Couldn't Update User.");
  }

  return respondWithJson(res, HTTPCodes.OK, {
    userID: updatedUser._id,
    email: updatedUser.email,
    username: updatedUser.username,
    mfaEnabled: updatedUser.mfaEnabled,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
  });
}
