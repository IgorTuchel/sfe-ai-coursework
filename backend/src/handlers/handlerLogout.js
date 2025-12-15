/**
 * @file handlerLogout.js
 * @description Handler for user logout.
 * Clears authentication cookies and removes refresh token from the database.
 * @module handlers/handlerLogout
 */

import RefreshToken from "../models/refreshTokenModel.js";
import { respondWithJson } from "../utils/json.js";

export async function handlerLogout(req, res) {
  res.clearCookie("accessToken");
  const refresh = req?.cookies?.refreshToken;
  if (refresh) {
    res.clearCookie("refreshToken");
    await RefreshToken.deleteOne({ token: refresh });
  }
  respondWithJson(res, 200, { message: "Logged out successfully." });
}
