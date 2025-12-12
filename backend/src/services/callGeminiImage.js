import geminiClient from "../config/gemini.js";
import { v4 as uuidv4 } from "uuid";
import { uploadObjectToS3 } from "./putObjectS3.js";
import cfg from "../config/config.js";

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
