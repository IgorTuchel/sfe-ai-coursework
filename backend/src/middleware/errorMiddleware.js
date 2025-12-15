/**
 * @file errorMiddleware.js
 * @description Centralized error handling middleware for Express applications.
 * Provides custom HTTP error classes and middleware to handle errors, log unexpected issues,
 * and return appropriate JSON responses with sensitive data redaction.
 * @module middleware/errorMiddleware
 */
import {
  HTTPCodes,
  respondWithErrorJson,
  respondWithJson,
} from "../utils/json.js";
import { logEntry, appendToErrorLog } from "../utils/errorWriter.js";
import cfg from "../config/config.js";

/**
 * Global error handling middleware for Express applications.
 *
 * @async
 * @param {Error} err - Error object thrown by route handlers or middleware.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @description Catches and processes all errors in the application. Handles custom HTTP errors
 * with appropriate status codes, file upload errors, and unexpected errors. For unexpected errors,
 * logs detailed information (timestamp, request details, stack trace) to the error log file with
 * automatic redaction of sensitive data (tokens, passwords, cookies, authorization headers).
 *
 * Error handling priority:
 * 1. Custom HTTPRequestError instances - returns appropriate status code and message
 * 2. Multer file size errors (LIMIT_FILE_SIZE) - returns 400 Bad Request
 * 3. Unexpected errors - logs to file and returns 500 Internal Server Error
 *
 * @example
 * app.use(errorHandlingMiddleware);
 *
 * @example
 * // Throwing custom errors in routes
 * throw new UnauthorizedError("Invalid credentials");
 * throw new NotFoundError("User not found");
 */
export async function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof HTTPRequestError) {
    if (err instanceof ForbiddenError) {
      return respondWithJson(res, err.statusCode, {
        error: err.message,
        type: err.type,
      });
    }
    return respondWithErrorJson(res, err.statusCode, err.message);
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return respondWithErrorJson(
      res,
      HTTPCodes.BAD_REQUEST,
      "File size exceeds the maximum allowed limit."
    );
  }

  console.error(
    `Unexpected error details can be found at: ${cfg.errorLogFile}`
  );

  const logContent = {
    TIMESTAMP: new Date().toISOString(),
    ERROR_MESSAGE: err.message,
    REQUEST_METHOD: req.method,
    REQUEST_URL: req.originalUrl,
    REQUEST_HEADERS: JSON.stringify(req.headers, (key, value) => {
      if (
        key.toLocaleLowerCase().includes("token") ||
        key.toLocaleLowerCase().includes("authorization") ||
        key.toLocaleLowerCase().includes("cookie")
      ) {
        return "[REDACTED]";
      }
      return value;
    }),
    REQUEST_BODY: JSON.stringify(req.body, (key, value) => {
      if (
        key.toLocaleLowerCase().includes("password") ||
        key.toLocaleLowerCase().includes("token")
      ) {
        return "[REDACTED]";
      }
      return value;
    }),
    STACK_TRACE: err.stack,
  };
  const formmatedLog = logEntry.replace(
    /{{(\w+)}}/g,
    (_, key) => logContent[key] || "N/A"
  );
  await appendToErrorLog(`${cfg.errorLogFile}`, formmatedLog);
  respondWithErrorJson(res, 500, "Internal Server Error");
}

/**
 * Base class for HTTP request errors.
 * @extends Error
 */
class HTTPRequestError extends Error {
  /**
   * Creates an HTTP request error.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Error class for 400 Bad Request responses.
 * @extends HTTPRequestError
 *
 * @example
 * throw new BadRequestError("Invalid email format");
 */
export class BadRequestError extends HTTPRequestError {
  /**
   * Creates a Bad Request error (400).
   * @param {string} message - Error message describing the bad request.
   */
  constructor(message) {
    super(message, HTTPCodes.BAD_REQUEST);
  }
}

/**
 * Error class for 401 Unauthorized responses.
 * @extends HTTPRequestError
 *
 * @example
 * throw new UnauthorizedError("Invalid credentials");
 */
export class UnauthorizedError extends HTTPRequestError {
  /**
   * Creates an Unauthorized error (401).
   * @param {string} message - Error message describing the authentication failure.
   */
  constructor(message) {
    super(message, HTTPCodes.UNAUTHORIZED);
  }
}

/**
 * Error class for 403 Forbidden responses with optional error type.
 * @extends HTTPRequestError
 *
 * @example
 * throw new ForbiddenError("Admin privileges required");
 * throw new ForbiddenError("MFA required", "MFA_REQUIRED_FOR_ADMIN");
 */
export class ForbiddenError extends HTTPRequestError {
  /**
   * Creates a Forbidden error (403).
   * @param {string} message - Error message describing the authorization failure.
   * @param {string} [type="TOKEN_EXPIRED"] - Error type identifier for client-side handling.
   */
  constructor(message, type = "TOKEN_EXPIRED") {
    super(message, HTTPCodes.FORBIDDEN);
    this.type = type;
  }
}

/**
 * Error class for 404 Not Found responses.
 * @extends HTTPRequestError
 *
 * @example
 * throw new NotFoundError("Character not found");
 */
export class NotFoundError extends HTTPRequestError {
  /**
   * Creates a Not Found error (404).
   * @param {string} message - Error message describing the missing resource.
   */
  constructor(message) {
    super(message, HTTPCodes.NOT_FOUND);
  }
}
