import cfg from "../config/config.js";
import { makeJWT } from "../middleware/jwt.js";
import { makeRefreshToken } from "../middleware/refreshToken.js";
import Users from "../models/usersModel.js";
import { hashPassword } from "../utils/hashedPass.js";
import { HTTPCodes, respondWithErrorJson } from "../utils/json.js";
import { evaulatePassword } from "../utils/passwordStrength.js";

export async function handlerMakeUser(req, res) {
  const { username, email, password } = req?.body || {};
  if (!username || !email || !password) {
    return respondWithErrorJson(
      res,
      HTTPCodes.BAD_REQUEST,
      "Username, email, and password are required."
    );
  }

  const cleanPassword = password.trim();
  const { valid, reason } = evaulatePassword(cleanPassword);
  if (!valid) {
    console.log("Password validation failed:", reason);
    return respondWithErrorJson(res, HTTPCodes.BAD_REQUEST, reason);
  }

  const hashPass = await hashPassword(cleanPassword);
  const newUser = new Users({
    username: username,
    email: email,
    passwordHash: hashPass,
    role: "user",
  });

  try {
    const savedUser = await newUser.save();
    const refreshToken = await makeRefreshToken(savedUser._id);
    const accessToken = await makeJWT(savedUser.email);

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

    return res.status(HTTPCodes.CREATED).json({
      userID: savedUser._id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      return respondWithErrorJson(
        res,
        HTTPCodes.BAD_REQUEST,
        "Email is already registered."
      );
    }
    return respondWithErrorJson(
      res,
      HTTPCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while creating the user."
    );
  }
}
