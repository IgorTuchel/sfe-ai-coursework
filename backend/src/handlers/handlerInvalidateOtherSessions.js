import { BadRequestError } from "../middleware/errorMiddleware.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { invalidateOtherRefreshTokens } from "../middleware/refreshTokenMiddleware.js";

export async function handlerRevokeOtherSessions(req, res) {
  const userID = req.user.id;
  const currentToken = req.cookies?.refreshToken;

  const success = await invalidateOtherRefreshTokens(userID, currentToken);
  if (!success) {
    throw new BadRequestError("Failed to invalidate other sessions.");
  }

  return respondWithJson(res, HTTPCodes.OK, {
    message: "Other sessions invalidated successfully.",
  });
}
