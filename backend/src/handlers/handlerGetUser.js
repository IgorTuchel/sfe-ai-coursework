import Users from "../models/usersModel.js";
import {
  HTTPCodes,
  respondWithErrorJson,
  respondWithJson,
} from "../utils/json.js";

export async function handlerGetUser(req, res) {
  const userId = req.body.userID;
  if (!userId)
    return respondWithErrorJson(
      res,
      HTTPCodes.BAD_REQUEST,
      "User ID is required."
    );
  const dbUser = await Users.findById(userId).select("-passwordHash");
  if (!dbUser) {
    return respondWithErrorJson(res, HTTPCodes.NOT_FOUND, "User not found.");
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
