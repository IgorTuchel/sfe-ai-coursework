import s3Client from "./s3.js";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import {
  colors,
  generateErrorLog,
  appendToErrorLog,
} from "../utils/errorWriter.js";
import connectDB from "./db.js";
import redisClient from "./redis.js";
import resendClient from "./resend.js";
import cfg from "./config.js";
import geminiClient from "./gemini.js";

const errorLogs = [];

const startupMessage =
  colors.green +
  `
===========================
    Starting service integrity checks...
===========================
` +
  colors.reset;

const errorMessage =
  colors.red +
  `
===========================
    Service startup encountered errors. Shutting down...    
===========================
`;

const successMessage =
  colors.green +
  `
===========================
    All services started successfully.
===========================
`;

async function serviceStartup() {
  console.log(startupMessage);
  console.log("* Verifiyng s3 connection intergrity...");
  try {
    await s3Client.send(new ListBucketsCommand({}));
    console.log(colors.green + "** s3 connection verified." + colors.reset);
  } catch (error) {
    console.log(
      colors.red +
        "** Failed to verify s3 connection: " +
        error.message +
        colors.reset
    );
    errorLogs.push("** Failed to verify s3 connection: " + error.message);
  }

  console.log("* Verifying Resend connection integrity...");
  try {
    // Send a test email to verify connection - no other way to verify connection
    const { data, error } = await resendClient.emails.send({
      from: cfg.resendSender,
      to: "delivered@resend.dev",
      subject: "Test Email from Service Startup",
      html: "<strong>This is a test email to verify Resend connection.</strong>",
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(
      colors.green + "** Resend connection verified. " + data.id + colors.reset
    );
  } catch (error) {
    console.log(
      colors.red +
        "** Failed to verify Resend connection: " +
        error.message +
        colors.reset
    );
    errorLogs.push("** Failed to verify Resend connection: " + error.message);
  }

  console.log("* Verifying MongoDB connection integrity...");
  const mongoStatus = await connectDB();
  if (!mongoStatus.success) {
    console.log(
      colors.red +
        "** Failed to verify MongoDB connection: " +
        mongoStatus.msg.message +
        colors.reset
    );
    errorLogs.push(
      "** Failed to verify MongoDB connection: " + mongoStatus.msg.message
    );
  } else {
    console.log(
      colors.green + "** MongoDB connection verified." + colors.reset
    );
  }

  console.log("* Verifying Redis connection integrity...");
  const redis = await redisClient;
  try {
    await redis.connect();
    await redis.ping();
    console.log(colors.green + "** Redis connection verified." + colors.reset);
  } catch (error) {
    console.log(
      colors.red +
        "** Failed to verify Redis connection: " +
        error.message +
        colors.reset
    );
    errorLogs.push("** Failed to verify Redis connection: " + error.message);
  }

  console.log("* Verifying Gemini Connection integrity...");
  try {
    const models = await geminiClient.models.list();
    console.log(
      colors.green +
        `** Gemini connection verified. Available models ${models.pageLength}+` +
        colors.reset
    );
  } catch (error) {
    console.log(
      colors.red +
        "** Failed to verify Gemini connection: " +
        error.message +
        colors.reset
    );
    errorLogs.push("** Failed to verify Gemini connection: " + error.message);
  }

  if (errorLogs.length > 0) {
    await appendToErrorLog(cfg.errorLogFile, errorLogs.join("\n"));
    console.log(errorMessage + colors.reset);
    console.log(
      colors.red +
        `Shutting Down - Startup Failed: Error log saved to ${errorLogFile}. Please check the log for details.` +
        colors.reset
    );
    process.exit(1);
  } else {
    console.log(successMessage + colors.reset);
  }
}

export default serviceStartup;
