import {
  makeResetPasswordVerification,
  verifyResetPasswordLink,
} from "../middleware/resetPasswordVerificationMiddleware.js";
import Users from "../models/usersModel.js";
import {
  HTTPCodes,
  respondWithErrorJson,
  respondWithJson,
} from "../utils/json.js";
import { evaulatePassword } from "../utils/passwordStrength.js";
import { hashPassword } from "../utils/hashedPass.js";
import {
  sanitiseInputEmail,
  sanitiseInputText,
} from "../utils/inputSantise.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middleware/errorMiddleware.js";

export async function handlerResetPassword(req, res) {
  const resetPasswordToken = req?.params?.token || "";
  if (!resetPasswordToken) {
    throw new BadRequestError("Reset password token is required.");
  }

  const { password } = req?.body || "";
  if (!password) {
    throw new BadRequestError("New password is required.");
  }

  const cleanPassword = sanitiseInputText(password);
  let validPass = evaulatePassword(cleanPassword);
  if (!validPass.valid) {
    throw new BadRequestError(validPass.reason);
  }

  const { valid, userID } = await verifyResetPasswordLink(resetPasswordToken);
  if (!valid) {
    throw new UnauthorizedError("Invalid or expired reset password token.");
  }

  const hashPass = await hashPassword(cleanPassword);
  const updatedUser = await Users.findByIdAndUpdate(
    userID,
    { passwordHash: hashPass },
    { new: true }
  );

  if (!updatedUser) {
    throw new BadRequestError("Couldn't update password.");
  }

  return respondWithJson(res, HTTPCodes.OK, {
    message: "Password has been reset successfully.",
  });
}

export async function handlerSendResetPasswordEmail(req, res) {
  const email = req?.body?.email || "";
  if (!email) {
    throw new BadRequestError("Email is required.");
  }

  const cleanEmail = sanitiseInputEmail(email);
  const dbUser = await Users.findOne({ email: cleanEmail });
  if (!dbUser) {
    return respondWithJson(res, HTTPCodes.OK, {
      message: "If the email is registered, a reset link has been sent.",
    });
  }

  const { success, _ } = await makeResetPasswordVerification(
    dbUser._id.toHexString(),
    cleanEmail
  );
  if (!success) {
    throw new BadRequestError("Failed to initiate password reset.");
  }

  return respondWithJson(res, HTTPCodes.OK, {
    message: "If the email is registered, a reset link has been sent.",
  });
}
