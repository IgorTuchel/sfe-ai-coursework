/**
 * @file hashedPass.js
 * @description Helpers for hashing and comparing passwords using bcrypt.
 * @module utils/hashedPass
 */

import bcrypt from "bcrypt";

/**
 * Hashes a plain-text password with a fixed cost factor.
 * @function hashPassword
 * @async
 * @param {string} password - Plain-text password to hash.
 * @returns {Promise<string>} Bcrypt hash of the password.
 */
export async function hashPassword(password) {
  const saltRounds = 13;
  const hashedPass = await bcrypt.hash(password, saltRounds);
  return hashedPass;
}

/**
 * Compares a plain-text password against a bcrypt hash.
 * @function comparePassword
 * @async
 * @param {string} password - Plain-text candidate password.
 * @param {string} hashedPass - Stored bcrypt hash.
 * @returns {Promise<boolean>} True if the password matches the hash.
 */
export async function comparePassword(password, hashedPass) {
  return await bcrypt.compare(password, hashedPass);
}
