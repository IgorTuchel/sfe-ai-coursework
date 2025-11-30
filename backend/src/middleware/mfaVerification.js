import cfg from "../config/config.js";
import redisClient from "../config/redis.js";
import {
  sendEmailWithResend,
  emailTemplates,
} from "../services/sendEmailService.js";

export async function createVerificationCode(userID, email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.setEx(`mfa_${userID}`, 300, code); // Code valid for 5 minutes

  const { success, data } = await sendEmailWithResend(
    email,
    cfg.resendSender,
    "Your Verification Code for History.Ai",
    emailTemplates.verification.replace("{{CODE}}", code)
  );
  if (!success) {
    return { success: false, data: data };
  }
  return { success: true, data: code };
}

export async function verifyCode(userId, code) {
  const storedCode = await redisClient.get(`mfa_${userId}`);
  if (!storedCode) {
    return false;
  }

  if (storedCode === code) {
    await redisClient.del(`mfa_${userId}`);
    return true;
  }
  return false;
}
