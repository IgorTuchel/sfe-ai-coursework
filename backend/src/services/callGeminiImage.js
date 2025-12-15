/**
 * @file callGeminiImage.js
 * @description Service for generating images using Google's Gemini Imagen AI.
 * Generates images from text prompts and uploads them to AWS S3 storage
 * with automatic retry logic.
 * @module services/callGeminiImage
 */

import geminiClient from "../config/gemini.js";
import { v4 as uuidv4 } from "uuid";
import { uploadObjectToS3 } from "./putObjectS3.js";
import cfg from "../config/config.js";

/**
 * Generates an image from a text prompt using Gemini Imagen AI and uploads it to S3.
 *
 * @async
 * @param {string} prompt - Text description of the image to generate.
 * @param {number} [retryCount=0] - Current retry attempt count (used internally for recursion).
 * @returns {Promise<Object>} Response object with success status and image URL or error.
 * @returns {boolean} returns.success - Whether the image generation and upload was successful.
 * @returns {string} [returns.imageUrl] - Public URL of the uploaded image on S3.
 * @returns {string} [returns.error] - Error message if the operation failed.
 *
 * @description Generates a JPEG image using Imagen 4.0, converts it to a buffer,
 * uploads to S3 in the 'generated-images/' directory with a UUID filename,
 * and returns the public S3 URL. Automatically retries up to 2 times on failure.
 *
 * @example
 * const result = await generateImage("A sunset over mountains");
 * if (result.success) {
 *   console.log(result.imageUrl); // "https://bucket.s3.region.amazonaws.com/generated-images/uuid.jpg"
 * } else {
 *   console.error(result.error);
 * }
 */
export async function generateImage(prompt, retryCount = 0) {
  try {
    const response = await geminiClient.models.generateImages({
      model: "imagen-4.0-fast-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
      },
    });

    const imageData = response.generatedImages[0];
    const fileName = `generated-images/${uuidv4()}.jpg`;

    const buffer = Buffer.from(imageData.image.imageBytes, "base64");
    const data = await uploadObjectToS3(fileName, buffer, "image/jpeg");

    if (!data.success) {
      console.error("S3 upload failed:", data.error);
      throw new Error("Error uploading generated image to S3");
    }

    const imageUrl = `https://${cfg.s3BucketName}.s3.${cfg.s3Region}.amazonaws.com/${fileName}`;

    return {
      success: true,
      imageUrl: imageUrl,
    };
  } catch (error) {
    if (retryCount < 2) {
      return await generateImage(prompt, retryCount + 1);
    }
    return {
      success: false,
      error: "Failed to generate image after multiple attempts.",
    };
  }
}
