/**
 * @file config.js
 * @description Centralized configuration module.
 * Loads, validates, and exports environment variables for the application.
 * Ensures strict validation: the app will fail to start if any required key is missing.
 * @module config/config
 */

import dotenv from "dotenv";
import { colors, generateErrorLog } from "../utils/errorWriter.js";

dotenv.config();

/**
 * Retrieves and validates a specific environment variable.
 * * @function getFromEnv
 * @param {string} key - The exact name of the environment variable (e.g., "PORT").
 * @returns {string} The value of the environment variable.
 * @throws {Error} Throws an error immediately if the variable is undefined or empty.
 */
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

/**
 * Global application configuration object.
 * Aggregates all validated environment variables and runtime constants.
 * @constant
 * @type {Object}
 */
const cfg = {
  port: getFromEnv("PORT"),
  nodeEnv: getFromEnv("NODE_ENV"),
  resetPasswordURL: getFromEnv("RESET_PASSWORD_URL"),
  mongoURI: getFromEnv("MONGO_URI"),

  geminiAPIKey: getFromEnv("GEMINI_API_KEY"),

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

  rrfScore: getFromEnv("RRF_SCORE"),
  ragMaxRetrieve: getFromEnv("RAG_MAX_RETRIEVE"),

  errorLogFile: await generateErrorLog(),
};

export default cfg;
