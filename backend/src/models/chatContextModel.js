import mongoose from "mongoose";

const chatContextSchema = new mongoose.Schema(
  {
    chatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    contextData: {
      type: [{ type: String }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const ChatContext = mongoose.model("ChatContext", chatContextSchema);

export default ChatContext;
