/**
 * @file usersModel.js
 * @description Mongoose schema and model for user accounts.
 * Manages user authentication data, roles, and MFA settings.
 * Includes cascade deletion for associated refresh tokens.
 * @module models/usersModel
 */

import mongoose from "mongoose";
import RefreshToken from "./refreshTokenModel.js";

/**
 * User schema for account management and authentication.
 * @typedef {Object} UserSchema
 * @property {string} username - User's display name.
 * @property {string} email - User's email address (unique).
 * @property {string} passwordHash - Bcrypt hashed password.
 * @property {boolean} mfaEnabled - Whether multi-factor authentication is enabled.
 * @property {string} role - User role: "user" or "admin".
 * @property {Date} createdAt - Timestamp of account creation.
 * @property {Date} updatedAt - Timestamp of last account update.
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    mfaEnabled: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

/**
 * Pre-deleteOne hook for cascade deletion.
 * Automatically removes all associated refresh tokens when a user is deleted.
 * @function
 * @async
 * @param {Function} next - Mongoose middleware next function.
 * @returns {Promise<void>}
 */
userSchema.pre("deleteOne", { query: true }, async function (next) {
  const userID = this.getQuery()["_id"];
  await RefreshToken.deleteMany({ userID: userID });
  next();
});

/**
 * Mongoose model for User.
 * @constant
 * @type {mongoose.Model<UserSchema>}
 */
const User = mongoose.model("User", userSchema);

export default User;
