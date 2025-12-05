import mongoose from "mongoose";

const characterVectorStoreSchema = new mongoose.Schema(
  {
    characterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      required: true,
      index: true,
    },
    text: { type: String, required: true },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

const CharacterVectorStore = mongoose.model(
  "CharacterVectorStore",
  characterVectorStoreSchema
);
export default CharacterVectorStore;
