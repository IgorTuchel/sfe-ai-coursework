import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, required: false, default: "New Chat" },
    messages: {
      type: [{ role: String, content: String, timestamp: Date }],
      required: true,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarked: { type: Boolean, default: false },
    characterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);

chatSchema.pre("deleteOne", { query: true }, async function (next) {
  const chatID = this.getQuery()["_id"];
  await mongoose.model("ChatContext").deleteMany({ chatID: chatID });
  next();
});

export default Chat;
