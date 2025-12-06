import Users from "../models/usersModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import { handleMFA } from "../middleware/mfaVerificationMiddleware.js";

export async function handlerDeleteUser(req, res) {
  const userID = req.user.id;
  const mfaCode = req.body.mfaCode;
  if (!userID) {
    throw new BadRequestError("User ID is required.");
  }

  if (!mfaCode) {
    throw new BadRequestError("MFA code is required.");
  }

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

  const deletedUser = await Users.findByIdAndDelete(userID);
  if (!deletedUser) {
    throw new NotFoundError("User not found.");
  }
  return respondWithJson(res, HTTPCodes.OK, {
    message: "User deleted successfully.",
  });
}
