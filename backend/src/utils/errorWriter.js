/**
 * @file errorWriter.js
 * @description Utilities for formatting and writing error logs to disk.
 * Provides console color codes, a log entry template, and helpers to create/append log files.
 * @module utils/errorWriter
 */

import fs from "fs";

/**
 * ANSI color codes for terminal output.
 * @constant
 * @type {{reset: string, red: string, green: string, yellow: string}}
 */
export const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

/**
 * Multi-line template for a formatted error log entry.
 * Placeholders (e.g. {{TIMESTAMP}}) are replaced before writing.
 * @constant
 * @type {string}
 */
export const logEntry = `
**********************************
*        ERROR LOG ENTRY        *
**********************************
Timestamp: {{TIMESTAMP}}
Error: {{ERROR_MESSAGE}}

Request Info:
Method: {{REQUEST_METHOD}}
URL: {{REQUEST_URL}}
Headers: {{REQUEST_HEADERS}}
Body: {{REQUEST_BODY}}

Stack Trace:
{{STACK_TRACE}}

**********************************

`;

/**
 * Creates a new error log file and writes an initial header line.
 * @function generateErrorLog
 * @async
 * @returns {Promise<string>} Absolute or relative path to the created log file.
 */
export async function generateErrorLog() {
  const dateNow = new Date();
  const fileName = `${dateNow.toISOString()}_error_log.log`;
  const fileLocation = `logs/${fileName}`;
  fs.writeFileSync(
    fileLocation,
    `Error log created at ${dateNow.toISOString()}\n`
  );
  console.log(`Error log file created at: ${fileLocation}`);
  return fileLocation;
}

/**
 * Appends a message to an existing error log file.
 * Fails silently except for a console error if the write fails.
 * @function appendToErrorLog
 * @async
 * @param {string} fileLocation - Path to the log file.
 * @param {string} msg - Message to append (a newline is added automatically).
 * @returns {Promise<void>}
 */
export async function appendToErrorLog(fileLocation, msg) {
  try {
    fs.appendFileSync(fileLocation, msg + "\n");
  } catch (error) {
    console.error("Failed to append to error log:", error);
  }
}
