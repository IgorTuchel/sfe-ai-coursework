/**
 * @file gemini.js
 * @description Configuration and initialization of the Gemini AI client.
 * Sets up the client for interacting with Google's Gemini AI services.
 * @module config/gemini
 */

import { GoogleGenAI } from "@google/genai";
import cfg from "./config.js";

/**
 * The configured Gemini AI client instance.
 * @type {GoogleGenAI}
 * @description Client for interacting with Google's Gemini AI services.
 * @see https://googleapis.dev/nodejs/genai/latest/
 */
const geminiClient = new GoogleGenAI({
  apiKey: cfg.geminiAPIKey,
});

export default geminiClient;
