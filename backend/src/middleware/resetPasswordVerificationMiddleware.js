import { v4 as uuid } from "uuid";
import { sendEmailWithResend, emailTemplates } from "../services/sendEmail.js";
import cfg from "../config/config.js";
import redisClient from "../config/redis.js";

export async function makeResetPasswordVerification(userID, email) {
  const linkSignature = uuid().toString();
  await redisClient.setEx(`resetpw_${linkSignature}`, 15 * 60, userID); // Code valid for 15 minutes

  const { success, data } = await sendEmailWithResend(
    email,
    cfg.resendSender,
    "Your Password Reset Code for History.Ai",
    emailTemplates.resetPassword.replace(
      "{{LINK}}",
      cfg.resetPasswordURL.replace("PORT", cfg.port) + linkSignature
    )
  );

  if (!success) {
    return { success: false, data: "Failed to send reset password email." };
  }
  return { success: true, data: data };
}

export async function verifyResetPasswordLink(linkSignature) {
  const storedUser = await redisClient.get(`resetpw_${linkSignature}`);
  if (!storedUser) {
    return { valid: false, userID: null };
  }

  await redisClient.del(`resetpw_${linkSignature}`);
  return { valid: true, userID: storedUser };
}
