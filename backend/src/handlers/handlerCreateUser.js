/**
 * @file handlerCreateUser.js
 * @description Handler for creating a new user account.
 * Validates input, hashes password, saves user to the database,
 * and generates JWT and refresh tokens.
 * @module handlers/handlerCreateUser
 */

import cfg from "../config/config.js";
import { BadRequestError } from "../middleware/errorMiddleware.js";
import { makeJWT } from "../middleware/jwtMiddleware.js";
import { makeRefreshToken } from "../middleware/refreshTokenMiddleware.js";
import Users from "../models/usersModel.js";
import { hashPassword } from "../utils/hashedPass.js";
import {
  sanitiseInputText,
  sanitiseInputEmail,
} from "../utils/inputSantise.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { evaulatePassword } from "../utils/passwordStrength.js";

export async function handlerMakeUser(req, res) {
  const { username, email, password } = req?.body || {};
  if (!username || !email || !password) {
    throw new BadRequestError("Username, email, and password are required.");
  }
  const cleanUsername = sanitiseInputText(username);
  const cleanEmail = sanitiseInputEmail(email);
  const cleanPassword = sanitiseInputText(password);

  const { valid, reason } = evaulatePassword(cleanPassword);
  if (!valid) {
    throw new BadRequestError(reason);
  }

  const hashPass = await hashPassword(cleanPassword);
  const newUser = new Users({
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: hashPass,
    role: "user",
  });

  try {
    const savedUser = await newUser.save();
    const refreshToken = await makeRefreshToken(savedUser._id);
    const accessToken = await makeJWT(savedUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: cfg.nodeEnv === "production",
      sameSite: "strict",
      maxAge: cfg.refreshTokenExpiresIn * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: cfg.nodeEnv === "production",
      sameSite: "strict",
      maxAge: cfg.jwtExpiresIn * 1000,
    });

    return respondWithJson(res, HTTPCodes.CREATED, {
      userID: savedUser._id,
      email: savedUser.email,
      username: savedUser.username,
      mfaEnabled: savedUser.mfaEnabled,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new BadRequestError("Email is already registered.");
    }
    throw error;
  }
}
