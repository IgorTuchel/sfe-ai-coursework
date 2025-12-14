/**
 * @file chatModel.js
 * @description Mongoose schema and model for chat sessions.
 * Manages chat conversations between users and AI characters with message history.
 * Includes cascade deletion for associated chat context.
 * @module models/chatModel
 */

import mongoose from "mongoose";

/**
 * Chat schema for conversation sessions.
 * @typedef {Object} ChatSchema
 * @property {string} chatName - Display name for the chat session.
 * @property {Object[]} messages - Array of message objects in conversation order.
 * @property {string} messages.role - Role of message sender ("user", "system").
 * @property {string} messages.content - Message text content.
 * @property {Date} messages.timestamp - When the message was sent.
 * @property {mongoose.Types.ObjectId} userId - Reference to User who owns this chat.
 * @property {boolean} bookmarked - Whether chat is bookmarked by user.
 * @property {mongoose.Types.ObjectId} characterID - Reference to Character in this chat.
 * @property {Date} createdAt - Timestamp of chat creation.
 * @property {Date} updatedAt - Timestamp of last chat update.
 */
const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, required: false, default: "New Chat" },
    messages: {
      type: [{ role: String, content: String, timestamp: Date }],
      required: true,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarked: { type: Boolean, default: false },
    characterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for Chat.
 * @constant
 * @type {mongoose.Model<ChatSchema>}
 */
export const Chat = mongoose.model("Chat", chatSchema);

/**
 * Pre-deleteOne hook for cascade deletion.
 * Automatically removes all associated chat context entries when a chat is deleted.
 * @function
 * @async
 * @param {Function} next - Mongoose middleware next function.
 * @returns {Promise<void>}
 */
chatSchema.pre("deleteOne", { query: true }, async function (next) {
  const chatID = this.getQuery()["_id"];
  await mongoose.model("ChatContext").deleteMany({ chatID: chatID });
  next();
});

export default Chat;
