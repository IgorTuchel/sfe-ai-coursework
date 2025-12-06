import { respondWithJson, HTTPCodes } from "../utils/json.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import Character from "../models/characterModel.js";
import { fileTypeFromBuffer } from "file-type";
import { uploadObjectToS3 } from "../services/putObjectS3.js";
import cfg from "../config/config.js";

export async function handlerUpdateCharacter(req, res) {
  const { name, description, systemPrompt, firstMessage, isPublic } = req.body;
  const characterID = req.params.id;
  let avatarUrl = null;

  const dbCharacter = await Character.findById(characterID);
  if (!dbCharacter) {
    throw new NotFoundError("Character not found");
  }

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

  const changes = {
    name: name || dbCharacter.name,
    description: description || dbCharacter.description,
    systemPrompt: systemPrompt || dbCharacter.systemPrompt,
    firstMessage: firstMessage || dbCharacter.firstMessage,
    isPublic: isPublic !== undefined ? isPublic : dbCharacter.isPublic,
    avatarUrl: avatarUrl || dbCharacter.avatarUrl,
  };

  if (
    changes.systemPrompt.includes("{RETRIVED_RELEVANT_DATA}") === false ||
    changes.systemPrompt.includes("{CONVERSATION_CONTEXT}") === false
  ) {
    throw new BadRequestError(
      "System prompt must include both {RETRIVED_RELEVANT_DATA} and {CONVERSATION_CONTEXT} placeholders."
    );
  }

  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      characterID,
      changes,
      { new: true }
    );
    respondWithJson(res, HTTPCodes.OK, {
      character: updatedCharacter,
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}
