import {
  respondWithErrorJson,
  respondWithJson,
  HTTPCodes,
} from "../utils/json.js";
import { evaulatePassword } from "../utils/passwordStrength.js";
import { hashPassword } from "../utils/hashedPass.js";
import Users from "../models/usersModel.js";
import {
  createVerificationCode,
  verifyCode,
} from "../middleware/mfaVerification.js";

export async function handlerUpdateUser(req, res) {
  const { userID, password, mfaEnabled, username, mfaCode } = req.body;
  if (!password && !mfaEnabled && !username) {
    return respondWithErrorJson(
      res,
      HTTPCodes.BAD_REQUEST,
      "A change is required but no changes were provided."
    );
  }

  const changes = {};

  if (mfaEnabled) {
    const mfaResult = await handleMFA(mfaCode, userID);
    if (!mfaResult.success) {
      return respondWithErrorJson(
        res,
        mfaResult.data.code,
        mfaResult.data.message
      );
    }
    changes.mfaEnabled = mfaResult.data.newStatus;
  }

  if (username) {
    username = username.trim();
    if (username.length < 3) {
      return respondWithErrorJson(
        res,
        HTTPCodes.BAD_REQUEST,
        "Username must be at least 3 characters long."
      );
    }
    changes.username = username;
  }

  if (password) {
    const { valid, reason } = evaulatePassword(password);
    if (!valid) {
      return respondWithErrorJson(res, HTTPCodes.BAD_REQUEST, reason);
    }
    changes.passwordHash = await hashPassword(password);
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(userID, changes, {
      new: true,
    }).select("-passwordHash");

    if (!updatedUser) {
      return respondWithErrorJson(
        res,
        HTTPCodes.BAD_REQUEST,
        "Couldn't Update User."
      );
    }

    return respondWithJson(res, HTTPCodes.OK, {
      userID: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    return respondWithErrorJson(
      res,
      HTTPCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while updating the user."
    );
  }
}

async function handleMFA(mfaCode, userID) {
  const dbUser = await Users.findById(userID);
  if (!dbUser) {
    return {
      success: false,
      data: { code: HTTPCodes.NOT_FOUND, message: "User not found." },
    };
  }

  if (mfaCode) {
    const verified = await verifyCode(userID, mfaCode);
    if (!verified) {
      return {
        success: false,
        data: { code: HTTPCodes.BAD_REQUEST, message: "Invalid MFA code." },
      };
    }
    return {
      success: true,
      data: {
        newStatus: !dbUser.mfaEnabled,
      },
    };
  }

  const { success, _ } = await createVerificationCode(userID, dbUser.email);
  if (!success) {
    return {
      success: false,
      data: {
        code: HTTPCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to send verification code.",
      },
    };
  }

  return {
    success: false,
    data: {
      code: HTTPCodes.FORBIDDEN,
      message: "Verification code sent to emial.",
    },
  };
}
