/**
 * @file chatContextModel.js
 * @description Mongoose schema for storing chat conversation context.
 * Maintains context history for chat sessions to ensure coherent conversations.
 * @module models/chatContextModel
 */

import mongoose from "mongoose";

/**
 * Chat context schema for conversation history management.
 * Stores sequential context data for maintaining conversation flow.
 * @typedef {Object} ChatContextSchema
 * @property {mongoose.Types.ObjectId} chatID - Reference to associated Chat session.
 * @property {string[]} contextData - Array of context strings representing conversation history.
 * @property {Date} createdAt - Timestamp of context creation.
 * @property {Date} updatedAt - Timestamp of last context update.
 */
const chatContextSchema = new mongoose.Schema(
  {
    chatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    contextData: {
      type: [{ type: String }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for ChatContext.
 * @constant
 * @type {mongoose.Model<ChatContextSchema>}
 */
const ChatContext = mongoose.model("ChatContext", chatContextSchema);

export default ChatContext;
