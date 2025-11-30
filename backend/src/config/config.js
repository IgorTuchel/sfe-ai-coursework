import dotenv from "dotenv";
import { colors } from "../utils/errorWriter.js";

dotenv.config();

const cfg = {
  port: getFromEnv("PORT"),
  nodeEnv: getFromEnv("NODE_ENV"),
  mongoURI: getFromEnv("MONGO_URI"),
  jwtSecret: getFromEnv("JWT_SECRET"),
  jwtIss: getFromEnv("JWT_ISS"),
  jwtExpiresIn: getFromEnv("JWT_EXPIRES_IN"),
  refreshTokenExpiresIn: getFromEnv("REFRESH_TOKEN_EXPIRES_IN"),
  awsAccessKeyId: getFromEnv("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: getFromEnv("AWS_SECRET_ACCESS_KEY"),

  s3Region: getFromEnv("S3_REGION"),
  s3BucketName: getFromEnv("S3_BUCKET_NAME"),

  resendApiKey: getFromEnv("RESEND_API_KEY"),
  resendSender: getFromEnv("RESEND_SENDER"),
};

function getFromEnv(key) {
  const val = process.env[key];
  console.log(
    colors.yellow + `Loading environment variable: ${key}` + colors.reset
  );
  if (!val) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return val;
}

export default cfg;
