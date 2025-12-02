import { comparePassword } from "../utils/hashedPass.js";
import Users from "../models/usersModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { handleMFA } from "../middleware/mfaVerificationMiddleware.js";
import {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} from "../middleware/errorMiddleware.js";
import {
  sanitiseInputEmail,
  sanitiseInputText,
} from "../utils/inputSantise.js";
import { makeJWT } from "../middleware/jwtMiddleware.js";
import { makeRefreshToken } from "../middleware/refreshTokenMiddleware.js";
import cfg from "../config/config.js";

export async function handlerLogIn(req, res) {
  const { email, password, mfaCode, rememberMe } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required.");
  }
  const cleanEmail = sanitiseInputEmail(email);
  const cleanPassword = sanitiseInputText(password);

  const dbUser = await Users.findOne({ email: cleanEmail });
  if (!dbUser) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const passwordMatch = await comparePassword(
    cleanPassword,
    dbUser.passwordHash
  );
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  if (dbUser.mfaEnabled) {
    const { success, data } = await handleMFA(mfaCode, dbUser._id);
    if (!success) {
      throw new ForbiddenError(data.message, "MFA_REQUIRED");
    }
  }

  if (rememberMe) {
    const refreshToken = await makeRefreshToken(dbUser._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: cfg.nodeEnv === "production",
      sameSite: "strict",
      maxAge: cfg.refreshTokenExpiresIn * 1000,
    });
  }

  const accessToken = await makeJWT(dbUser._id);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: cfg.nodeEnv === "production",
    sameSite: "strict",
    maxAge: cfg.jwtExpiresIn * 1000,
  });

  return respondWithJson(res, HTTPCodes.OK, {
    message: "Login successful",
    userID: dbUser._id,
    email: dbUser.email,
    username: dbUser.username,
    mfaEnabled: dbUser.mfaEnabled,
    createdAt: dbUser.createdAt,
  });
}
