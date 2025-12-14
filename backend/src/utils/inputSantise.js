/**
 * @file inputSanitise.js
 * @description Simple input sanitisation helpers for emails and generic text.
 * @module utils/inputSanitise
 */

/**
 * Normalises an email-like input: trims and converts to lowercase.
 * @function sanitiseInputEmail
 * @param {*} input - Raw email input.
 * @returns {string} Sanitised email string.
 */
export function sanitiseInputEmail(input) {
  return String(input).trim().toLowerCase();
}

/**
 * Normalises generic text input by coercing to string and trimming whitespace.
 * @function sanitiseInputText
 * @param {*} input - Raw text input.
 * @returns {string} Sanitised text string.
 */
export function sanitiseInputText(input) {
  return String(input).trim();
}
