/**
 * @file handlerGetUser.js
 * @description Handler for retrieving user information.
 * Validates user ID and fetches user details from the database.
 * @module handlers/handlerGetUser
 */

import Users from "../models/usersModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";

export async function handlerGetUser(req, res) {
  const userID = req.user.id;
  if (!userID) throw new BadRequestError("User ID is required.");
  const dbUser = await Users.findById(userID).select("-passwordHash");
  if (!dbUser) {
    throw new NotFoundError("User not found.");
  }
  return respondWithJson(res, HTTPCodes.OK, {
    userID: dbUser._id,
    email: dbUser.email,
    username: dbUser.username,
    role: dbUser.role,
    mfaEnabled: dbUser.mfaEnabled,
    createdAt: dbUser.createdAt,
  });
}
