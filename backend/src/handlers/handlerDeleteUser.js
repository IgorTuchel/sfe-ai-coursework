import Users from "../models/usersModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";

export async function handlerDeleteUser(req, res) {
  const userID = req.user.id;
  if (!userID) {
    throw new BadRequestError("User ID is required.");
  }
  const deletedUser = await Users.findByIdAndDelete(userID);
  if (!deletedUser) {
    throw new NotFoundError("User not found.");
  }
  return respondWithJson(res, HTTPCodes.OK, {
    message: "User deleted successfully.",
  });
}
