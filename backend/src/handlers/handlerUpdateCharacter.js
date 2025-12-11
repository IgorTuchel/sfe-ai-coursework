import { respondWithJson, HTTPCodes } from "../utils/json.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/errorMiddleware.js";
import Character from "../models/characterModel.js";
import { fileTypeFromBuffer } from "file-type";
import { uploadObjectToS3 } from "../services/putObjectS3.js";
import cfg from "../config/config.js";
import { invalidateCharacterCache } from "../services/characterContextManager.js";

export async function handlerUpdateCharacter(req, res) {
  const {
    name,
    description,
    systemPrompt,
    firstMessage,
    isPublic,
    jsonScript,
    theme,
  } = req.body;

  const characterID = req.params.id;

  const dbCharacter = await Character.findById(characterID);
  if (!dbCharacter) {
    throw new NotFoundError("Character not found");
  }

  let parsedJsonScript = undefined;
  if (jsonScript) {
    if (typeof jsonScript !== "string") {
      throw new BadRequestError("JSON script must be an string");
    }
    try {
      parsedJsonScript = JSON.parse(jsonScript);
    } catch (err) {
      throw new BadRequestError("Invalid JSON script format");
    }
  }

  let parsedTheme = {
    backgroundColor: dbCharacter.theme.backgroundColor,
    fontFamily: dbCharacter.theme.fontFamily,
    backgroundImageUrl: dbCharacter.theme.backgroundImageUrl,
    backgroundOverlayOpacity: dbCharacter.theme.backgroundOverlayOpacity,
    primaryColor: dbCharacter.theme.primaryColor,
    userMessageColor: dbCharacter.theme.userMessageColor,
    secondaryColor: dbCharacter.theme.secondaryColor,
    systemMessageColor: dbCharacter.theme.systemMessageColor,
    bubbleOpacity: dbCharacter.theme.bubbleOpacity,
    bubbleBorderRadius: dbCharacter.theme.bubbleBorderRadius,
    inputBackgroundColor: dbCharacter.theme.inputBackgroundColor,
    inputTextColor: dbCharacter.theme.inputTextColor,
    inputBorderColor: dbCharacter.theme.inputBorderColor,
    sendButtonColor: dbCharacter.theme.sendButtonColor,
  };
  if (req.files["backgroundImage"]) {
    const fileType = await fileTypeFromBuffer(
      req.files["backgroundImage"][0].buffer
    );
    if (!fileType) {
      throw new BadRequestError("Could not determine file type of the avatar");
    }
    if (fileType.mime !== "image/png" && fileType.mime !== "image/jpeg") {
      throw new BadRequestError(
        "Only PNG and JPEG files are allowed for background image"
      );
    }

    const fileName = `wallpapers/${Date.now()}_${
      req.files["backgroundImage"][0].originalname
    }`;
    const data = await uploadObjectToS3(
      fileName,
      req.files["backgroundImage"][0].buffer,
      fileType.mime
    );

    if (!data.success) {
      throw new BadRequestError("Error uploading wallpaper to S3");
    }

    parsedTheme.backgroundImageUrl = `https://${cfg.s3BucketName}.s3.${cfg.s3Region}.amazonaws.com/${fileName}`;
  }

  if (theme) {
    if (typeof theme !== "string") {
      throw new BadRequestError("Theme must be a string");
    }
    try {
      const themeObj = JSON.parse(theme);
      for (const key in themeObj) {
        parsedTheme[key] = themeObj[key];
      }
    } catch (err) {
      throw new BadRequestError("Invalid theme format");
    }
  }

  let avatarUrl = null;
  if (req.files["avatar"]) {
    const fileType = await fileTypeFromBuffer(req.files["avatar"][0].buffer);
    if (!fileType) {
      throw new BadRequestError("Could not determine file type of the avatar");
    }
    if (fileType.mime !== "image/png" && fileType.mime !== "image/jpeg") {
      throw new BadRequestError(
        "Only PNG and JPEG files are allowed for avatar"
      );
    }

    let fileName = `avatars/${Date.now()}_${
      req.files["avatar"][0].originalname
    }`;
    const data = await uploadObjectToS3(
      fileName,
      req.files["avatar"][0].buffer,
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
    jsonScript: parsedJsonScript || dbCharacter.jsonScript,
    isPublic: isPublic !== undefined ? isPublic : dbCharacter.isPublic,
    avatarUrl: avatarUrl || dbCharacter.avatarUrl,
    theme: parsedTheme || dbCharacter.theme,
  };

  if (
    changes.systemPrompt.includes("{RETRIVED_RELEVANT_DATA}") === false ||
    changes.systemPrompt.includes("{CONVERSATION_CONTEXT}") === false ||
    changes.systemPrompt.includes("{USERNAME}") === false
  ) {
    throw new BadRequestError(
      "System prompt must include both {RETRIVED_RELEVANT_DATA}, {CONVERSATION_CONTEXT}, {USERNAME} placeholders."
    );
  }

  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      characterID,
      changes,
      { new: true, runValidators: true }
    );
    respondWithJson(res, HTTPCodes.OK, {
      character: updatedCharacter,
    });
  } catch (error) {
    throw new BadRequestError("Error updating character: " + error.message);
  }

  invalidateCharacterCache(characterID);
}
