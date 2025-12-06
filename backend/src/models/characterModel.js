import mongoose from "mongoose";
import CharacterVectorStore from "./characterVectorDataStore.js";

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
