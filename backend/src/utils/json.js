/**
 * @file json.js
 * @description Helpers for sending JSON HTTP responses and common HTTP status codes.
 * @module utils/json
 */

/**
 * Sends a JSON error response with a standard `{ error: string }` payload.
 * @function respondWithErrorJson
 * @async
 * @param {import("express").Response} res - Express response object.
 * @param {number} code - HTTP status code to send.
 * @param {string} msg - Error message.
 * @returns {Promise<void>}
 */
export async function respondWithErrorJson(res, code, msg) {
  respondWithJson(res, code, { error: msg });
}

/**
 * Sends an arbitrary JSON payload with the given HTTP status code.
 * @function respondWithJson
 * @async
 * @param {import("express").Response} res - Express response object.
 * @param {number} code - HTTP status code to send.
 * @param {Object} payload - Serializable JSON payload.
 * @returns {Promise<void>}
 */
export async function respondWithJson(res, code, payload) {
  let jsonData = JSON.stringify(payload);
  res.header("Content-Type", "application/json");
  res.status(code).send(jsonData);
}

/**
 * Common HTTP status codes used by the application.
 * @constant
 * @type {{OK: number, CREATED: number, BAD_REQUEST: number, UNAUTHORIZED: number, FORBIDDEN: number, NOT_FOUND: number, INTERNAL_SERVER_ERROR: number}}
 */
export const HTTPCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
