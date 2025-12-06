import RefreshToken from "../models/refreshTokenModel.js";
import cfg from "../config/config.js";
import { randomBytes } from "crypto";

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
