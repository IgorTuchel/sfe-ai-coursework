import mongoose from "mongoose";
import CharacterVectorStore from "./characterVectorDataStore.js";

const themeSchema = new mongoose.Schema(
  {
    backgroundColor: { type: String, default: "" },
    fontFamily: { type: String, default: "" },
    backgroundImageUrl: { type: String, default: "" },
    backgroundOverlayOpacity: { type: Number, default: 0.5 },
    primaryColor: { type: String, default: "" },
    userMessageColor: { type: String, default: "" },
    secondaryColor: { type: String, default: "" },
    systemMessageColor: { type: String, default: "" },
    bubbleOpacity: { type: Number, default: 1 },
    bubbleBorderRadius: { type: String, default: "" },
    inputBackgroundColor: { type: String, default: "" },
    inputTextColor: { type: String, default: "" },
    inputBorderColor: { type: String, default: "" },
    sendButtonColor: { type: String, default: "" },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
      required: true,
    },
    probability: { type: Number, required: true, default: 1.0 },
  },
  { _id: false }
);

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    nextNode: { type: String, required: true },
  },
  { _id: false }
);

const scriptNode = new mongoose.Schema(
  {
    triggers: { type: [String], required: true },
    responses: { type: [responseSchema], required: true },
    options: { type: [optionSchema], required: true },
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatarUrl: {
      type: String,
      required: false,
      default:
        "https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/avatars/default-avatar.png",
    },
    description: { type: String, required: false, default: "" },
    systemPrompt: { type: String, required: false, default: "" },
    firstMessage: { type: String, required: false, default: "" },
    isPublic: { type: Boolean, default: false },
    theme: { type: themeSchema, default: () => ({}) },
    jsonScript: {
      type: [scriptNode],
      default: [
        {
          triggers: ["hi", "hello", "hey", "greetings"],
          responses: [
            {
              text: "Hello! How can I assist you today?",
              type: "text",
              probability: 1.0,
            },
          ],
          options: [
            { text: "how are you", nextNode: "how are you" },
            { text: "who are you", nextNode: "who are you" },
          ],
        },
        {
          triggers: ["how are you"],
          responses: [
            {
              text: "I'm just a bunch of code, but thanks for asking!",
              type: "text",
              probability: 1.0,
            },
          ],
          options: [],
        },
        {
          triggers: ["who are you"],
          responses: [
            {
              text: "I'm your friendly AI character, here to chat with you!",
              type: "text",
              probability: 1.0,
            },
          ],
          options: [],
        },
      ],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

characterSchema.pre("deleteOne", { query: true }, async function (next) {
  const characterID = this.getQuery()["_id"];
  await CharacterVectorStore.deleteMany({ characterID: characterID });
  next();
});

const Character = mongoose.model("Character", characterSchema);
export default Character;
