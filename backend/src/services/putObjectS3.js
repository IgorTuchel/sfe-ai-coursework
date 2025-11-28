import s3Client from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import cfg from "../config/config.js";

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
