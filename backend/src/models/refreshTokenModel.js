/**
 * @file refreshTokenModel.js
 * @description Mongoose schema for JWT refresh token storage and management.
 * Stores refresh tokens with expiration tracking for secure token rotation.
 * @module models/refreshTokenModel
 */

import mongoose from "mongoose";

/**
 * Refresh token schema for authentication token management.
 * @typedef {Object} RefreshTokenSchema
 * @property {string} token - Refresh token string (unique).
 * @property {mongoose.Types.ObjectId} userID - Reference to User who owns this token.
 * @property {Date} expiresAt - Token expiration timestamp.
 * @property {Date} createdAt - Timestamp of token creation.
 * @property {Date} updatedAt - Timestamp of last token update.
 */
const refreshSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

/**
 * Mongoose model for RefreshToken.
 * @constant
 * @type {mongoose.Model<RefreshTokenSchema>}
 */
const RefreshToken = mongoose.model("RefreshToken", refreshSchema);

export default RefreshToken;
