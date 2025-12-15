/**
 * @file putObjectS3.js
 * @description Service for uploading files and objects to AWS S3 storage.
 * Provides functionality to upload binary data, images, and other file types
 * to S3 buckets with proper content type configuration.
 * @module services/putObjectS3
 */

import s3Client from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import cfg from "../config/config.js";

/**
 * Uploads an object to AWS S3 storage.
 *
 * @async
 * @param {string} fileName - The key/path for the object in the S3 bucket (e.g., "images/photo.jpg").
 * @param {Buffer|Stream|string} objectData - The data to upload (Buffer, readable stream, or string).
 * @param {string} mimeType - The MIME type of the object (e.g., "image/jpeg", "application/pdf").
 * @returns {Promise<Object>} Response object with success status and AWS response data or error.
 * @returns {boolean} returns.success - Whether the upload was successful.
 * @returns {Object} [returns.data] - AWS S3 PutObject response metadata.
 * @returns {Error} [returns.error] - Error object if the upload failed.
 *
 * @description Uploads data to the configured S3 bucket with the specified file name and content type.
 * The uploaded object will be accessible at: https://{bucket}.s3.{region}.amazonaws.com/{fileName}
 *
 * @example
 * const buffer = Buffer.from("Hello World");
 * const result = await uploadObjectToS3("documents/hello.txt", buffer, "text/plain");
 * if (result.success) {
 *   console.log("Upload successful:", result.data);
 * }
 *
 * @example
 * const imageBuffer = fs.readFileSync("photo.jpg");
 * const result = await uploadObjectToS3("user-photos/photo.jpg", imageBuffer, "image/jpeg");
 * if (result.success) {
 *   const url = `https://${cfg.s3BucketName}.s3.${cfg.s3Region}.amazonaws.com/user-photos/photo.jpg`;
 * }
 */
export async function uploadObjectToS3(fileName, objectData, mimeType) {
  const command = new PutObjectCommand({
    Bucket: cfg.s3BucketName,
    Key: fileName,
    Body: objectData,
    ContentType: mimeType,
  });

  try {
    const data = await s3Client.send(command);
    console.log("Successfully uploaded object to S3:", data);
    return { success: true, data: data };
  } catch (error) {
    console.error("Error uploading object to S3:", error);
    return { success: false, error: error };
  }
}
