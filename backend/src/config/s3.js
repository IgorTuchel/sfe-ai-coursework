/**
 * @file s3.js
 * @description AWS S3 Client configuration and initialization.
 * Uses AWS SDK v3 to create a client instance for object storage operations.
 * @module config/s3
 */

import cfg from "./config.js";
import s3 from "@aws-sdk/client-s3";

/**
 * The configured AWS S3 Client instance.
 * @type {s3.S3Client}
 * @description Client for interacting with AWS S3 services.
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
 */
const s3Client = new s3.S3Client({
  region: cfg.s3Region,
  credentials: {
    accessKeyId: cfg.awsAccessKeyId,
    secretAccessKey: cfg.awsSecretAccessKey,
  },
});

export default s3Client;
