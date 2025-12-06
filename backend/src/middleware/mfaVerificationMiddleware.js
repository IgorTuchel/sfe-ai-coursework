import cfg from "../config/config.js";
import redisClient from "../config/redis.js";
import { sendEmailWithResend, emailTemplates } from "../services/sendEmail.js";
import { HTTPCodes } from "../utils/json.js";
import Users from "../models/usersModel.js";

async function createVerificationCode(userID, email) {
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

async function verifyCode(userID, code) {
  const storedCode = await redisClient.get(`mfa_${userID}`);
  if (!storedCode) {
    return false;
  }

  if (storedCode === code) {
    await redisClient.del(`mfa_${userID}`);
    return true;
  }
  return false;
}

export async function handleMFA(mfaCode, userID) {
  const dbUser = await Users.findById(userID);
  if (!dbUser) {
    return {
      success: false,
      data: { code: HTTPCodes.NOT_FOUND, message: "User not found." },
    };
  }

  if (mfaCode) {
    if (mfaCode.length !== 6) {
      return {
        success: false,
        data: {
          code: HTTPCodes.BAD_REQUEST,
          message: "MFA code must be 6 digits.",
        },
      };
    }
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
        mfaEnabled: dbUser.mfaEnabled,
      },
    };
  }

  const { success, _ } = await createVerificationCode(userID, dbUser.email);
  if (!success) {
    return {
      success: false,
      data: {
        code: HTTPCodes.BAD_REQUEST,
        message: "Failed to send verification code.",
      },
    };
  }

  return {
    success: false,
    data: {
      code: HTTPCodes.FORBIDDEN,
      message: "Verification code sent to email.",
    },
  };
}
