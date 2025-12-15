/**
 * @file characterModel.js
 * @description Mongoose schema and model for AI character entities.
 * Defines character data structure including appearance customization, conversation scripts, and thematic styling. Includes cascade deletion for associated vector stores.
 * @module models/characterModel
 */

import mongoose from "mongoose";
import CharacterVectorStore from "./characterVectorDataStore.js";
import Chat from "./chatModel.js";

/**
 * Theme configuration schema for character chat interface styling.
 * Controls visual appearance including colors, opacity, and layout properties.
 * @typedef {Object} ThemeSchema
 * @property {string} backgroundColor - Background color for chat interface.
 * @property {string} fontFamily - Font family for text display.
 * @property {string} backgroundImageUrl - URL for background image.
 * @property {number} backgroundOverlayOpacity - Opacity of background overlay (0-1).
 * @property {string} primaryColor - Primary theme color, used for the user bubble color.
 * @property {string} userMessageColor - Color for user message text inside the bubble, used for the system message bubble.
 * @property {string} secondaryColor - Secondary theme color.
 * @property {string} systemMessageColor - Color for system message text inside the bubble.
 * @property {number} bubbleOpacity - Opacity of message bubbles (0-1).
 * @property {string} bubbleBorderRadius - Border radius for message bubbles.
 * @property {string} inputBackgroundColor - Background color for input field.
 * @property {string} inputTextColor - Text color in input field.
 * @property {string} inputBorderColor - Border color for input field.
 * @property {string} sendButtonColor - Color for send button.
 */
const themeSchema = new mongoose.Schema(
  {
    backgroundColor: { type: String, default: "" },
    fontFamily: { type: String, default: "" },
    backgroundImageUrl: { type: String, default: "" },
    backgroundOverlayOpacity: { type: Number, default: 0.5 },
    primaryColor: { type: String, default: "" },
    userMessageColor: { type: String, default: "" },
    secondaryColor: { type: String, default: "" },
    systemMessageColor: { type: String, default: "" },
    bubbleOpacity: { type: Number, default: 1 },
    bubbleBorderRadius: { type: String, default: "" },
    inputBackgroundColor: { type: String, default: "" },
    inputTextColor: { type: String, default: "" },
    inputBorderColor: { type: String, default: "" },
    sendButtonColor: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Response schema for scripted character responses.
 * Supports weighted probability for response variation.
 * @typedef {Object} ResponseSchema
 * @property {string} text - Response text content.
 * @property {string} type - Response type: "text" or "image" -- Although we dont utilise this really due to time constraints, but can be easily extended.
 * @property {number} probability - Probability weight for response selection (default: 1.0).
 */
const responseSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
      required: true,
    },
    probability: { type: Number, required: true, default: 1.0 },
  },
  { _id: false }
);

/**
 * Option schema for branching conversation paths.
 * Defines user-selectable options that lead to specific script nodes.
 * @typedef {Object} OptionSchema
 * @property {string} text - Display text for the option.
 * @property {string} nextNode - Identifier of the next script node to execute.
 */
const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    nextNode: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Script node schema for conversation flow control.
 * Maps trigger phrases to responses and conversation branches.
 * @typedef {Object} ScriptNode
 * @property {string[]} triggers - Array of trigger phrases that activate this node.
 * @property {ResponseSchema[]} responses - Array of possible responses with probabilities.
 * @property {OptionSchema[]} options - Array of user-selectable conversation branches.
 */
const scriptNode = new mongoose.Schema(
  {
    triggers: { type: [String], required: true },
    responses: { type: [responseSchema], required: true },
    options: { type: [optionSchema], required: true },
  },
  { _id: false }
);

/**
 * Character schema defining AI character entities.
 * @typedef {Object} CharacterSchema
 * @property {string} name - Character display name.
 * @property {string} avatarUrl - URL for character avatar image.
 * @property {string} description - Character description or bio.
 * @property {string} systemPrompt - System prompt for AI behavior configuration.
 * @property {string} firstMessage - Initial message sent by character.
 * @property {boolean} isPublic - Whether character is publicly accessible.
 * @property {ThemeSchema} theme - Visual theme configuration.
 * @property {ScriptNode[]} jsonScript - Array of conversation script nodes.
 * @property {mongoose.Types.ObjectId} ownerId - Reference to admin who created the character.
 * @property {Date} createdAt - Timestamp of character creation.
 * @property {Date} updatedAt - Timestamp of last character update.
 */
const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatarUrl: {
      type: String,
      required: false,
      default:
        "https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/avatars/default-avatar.png",
    },
    description: { type: String, required: false, default: "" },
    systemPrompt: { type: String, required: false, default: "" },
    firstMessage: { type: String, required: false, default: "" },
    isPublic: { type: Boolean, default: false },
    theme: { type: themeSchema, default: () => ({}) },
    jsonScript: {
      type: [scriptNode],
      default: [
        {
          triggers: ["hi", "hello", "hey", "greetings"],
          responses: [
            {
              text: "Hello! How can I assist you today?",
              type: "text",
              probability: 1.0,
            },
          ],
          options: [
            { text: "how are you", nextNode: "how are you" },
            { text: "who are you", nextNode: "who are you" },
          ],
        },
        {
          triggers: ["how are you"],
          responses: [
            {
              text: "I'm just a bunch of code, but thanks for asking!",
              type: "text",
              probability: 1.0,
            },
          ],
          options: [],
        },
        {
          triggers: ["who are you"],
          responses: [
            {
              text: "I'm your friendly AI character, here to chat with you!",
              type: "text",
              probability: 1.0,
            },
          ],
          options: [],
        },
      ],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-deleteOne hook for cascade deletion.
 * Automatically removes all associated vector store entries & chat records when a character is deleted.
 * @function
 * @async
 * @param {Function} next - Mongoose middleware next function.
 * @returns {Promise<void>}
 */
characterSchema.pre("deleteOne", { query: true }, async function (next) {
  const characterID = this.getQuery()["_id"];
  await CharacterVectorStore.deleteMany({ characterID: characterID });
  await Chat.deleteMany({ characterID: characterID });
  next();
});

/**
 * Mongoose model for Character.
 * @constant
 * @type {mongoose.Model<CharacterSchema>}
 */
const Character = mongoose.model("Character", characterSchema);
export default Character;
