import {
  HTTPCodes,
  respondWithErrorJson,
  respondWithJson,
} from "../utils/json.js";
import { logEntry, appendToErrorLog } from "../utils/errorWriter.js";
import cfg from "../config/config.js";

export async function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof HTTPRequestError) {
    if (err instanceof ForbiddenError) {
      return respondWithJson(res, err.statusCode, {
        message: err.message,
        type: err.type,
      });
    }
    return respondWithErrorJson(res, err.statusCode, err.message);
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

class HTTPRequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.BAD_REQUEST);
  }
}

export class UnauthorizedError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.UNAUTHORIZED);
  }
}
export class ForbiddenError extends HTTPRequestError {
  constructor(message, type = "TOKEN_EXPIRED") {
    super(message, HTTPCodes.FORBIDDEN);
    this.type = type;
  }
}

export class NotFoundError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.NOT_FOUND);
  }
}
