import { BadRequestError } from "../middleware/errorMiddleware.js";
import Character from "../models/characterModel.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { fileTypeFromBuffer } from "file-type";
import { uploadObjectToS3 } from "../services/putObjectS3.js";
import cfg from "../config/config.js";
export async function handlerCreateCharacter(req, res) {
  const {
    name,
    description,
    systemPrompt,
    firstMessage,
    isPublic,
    jsonScript,
  } = req.body;
  if (!name) {
    throw new BadRequestError("Character name is required");
  }

  let parsedJsonScript = undefined;
  if (jsonScript) {
    if (typeof jsonScript === "string") {
      try {
        parsedJsonScript = JSON.parse(jsonScript);
      } catch (err) {
        throw new BadRequestError("Invalid JSON script format");
      }
    } else if (typeof jsonScript === "object") {
      parsedJsonScript = jsonScript;
    } else {
      throw new BadRequestError("Invalid JSON script format");
    }
  }

  let avatarUrl = null;
  if (req.file) {
    const fileType = await fileTypeFromBuffer(req.file.buffer);
    if (!fileType) {
      throw new BadRequestError("Could not determine file type of the avatar");
    }
    if (fileType.mime !== "image/png" && fileType.mime !== "image/jpeg") {
      throw new BadRequestError(
        "Only PNG and JPEG files are allowed for avatar"
      );
    }

    let fileName = `avatars/${Date.now()}_${req.file.originalname}`;
    const data = await uploadObjectToS3(
      fileName,
      req.file.buffer,
      fileType.mime
    );

    if (!data.success) {
      throw new BadRequestError("Error uploading avatar to S3");
    }
    avatarUrl = `https://${cfg.s3BucketName}.s3.${cfg.s3Region}.amazonaws.com/${fileName}`;
  }

  const newCharacter = new Character({
    name,
    avatarUrl,
    description,
    systemPrompt,
    firstMessage,
    isPublic,
    jsonScript: parsedJsonScript,
    ownerId: req.user.id,
  });
  try {
    const savedCharacter = await newCharacter.save();
    respondWithJson(res, HTTPCodes.OK, {
      character: savedCharacter,
    });
  } catch (error) {
    throw new BadRequestError("Error creating character: " + error.message);
  }
}
