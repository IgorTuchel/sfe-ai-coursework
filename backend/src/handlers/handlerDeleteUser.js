import Users from "../models/usersModel.js";
import {
  HTTPCodes,
  respondWithErrorJson,
  respondWithJson,
} from "../utils/json.js";

export async function handlerDeleteUser(req, res) {
  const userId = req.body.userID;
  if (!userId)
    return respondWithErrorJson(
      res,
      HTTPCodes.BAD_REQUEST,
      "User ID is required."
    );
  try {
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return respondWithErrorJson(res, HTTPCodes.NOT_FOUND, "User not found.");
    }
    return respondWithJson(res, HTTPCodes.OK, {
      message: "User deleted successfully.",
    });
  } catch (error) {
    return respondWithErrorJson(
      res,
      HTTPCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while deleting the user."
    );
  }
}
