import { GoogleGenAI } from "@google/genai";
import cfg from "./config.js";

const geminiClient = new GoogleGenAI({
  apiKey: cfg.geminiAPIKey,
});

export default geminiClient;
