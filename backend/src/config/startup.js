import s3Client from "./s3.js";
import sesClient from "./ses.js";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { GetSendQuotaCommand } from "@aws-sdk/client-ses";
import { colors, writeErrorLogs } from "../utils/errorWriter.js";
import connectDB from "./db.js";
import fs from "node:fs/promises";

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
  // Connect to AWS S3
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

  // Connect to AWS SES
  console.log("* Verifying SES connection integrity...");
  try {
    await sesClient.send(new GetSendQuotaCommand({}));
    console.log(colors.green + "** SES connection verified." + colors.reset);
  } catch (error) {
    console.log(
      colors.red +
        "** Failed to verify SES connection: " +
        error.message +
        colors.reset
    );
    errorLogs.push("** Failed to verify SES connection: " + error.message);
  }

  // Connect to MongoDB
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
  // console.log("* Verifying Redis connection integrity...");
  // console.log("** Redis connection verified.");

  if (errorLogs.length > 0) {
    await writeErrorLogs(
      "service_startup",
      errorLogs,
      "Service startup failed"
    );
    console.log(errorMessage + colors.reset);
    process.exit(1);
  } else {
    console.log(successMessage + colors.reset);
  }
}

export default serviceStartup;
