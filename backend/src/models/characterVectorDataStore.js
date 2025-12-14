/**
 * @file characterVectorDataStore.js
 * @description Mongoose schema for storing character-related vector embeddings.
 * Supports semantic search and RAG functionality by storing text chunks with their embeddings.
 * @module models/characterVectorDataStore
 */

import mongoose from "mongoose";

/**
 * Vector store schema for character embedding storage.
 * Links text segments to their vector representations for similarity search.
 * @typedef {Object} CharacterVectorStoreSchema
 * @property {mongoose.Types.ObjectId} characterID - Reference to associated Character (indexed).
 * @property {string} text - Original text content that was embedded.
 * @property {number[]} embedding - Vector embedding array for semantic search.
 * @property {Date} createdAt - Timestamp of vector store entry creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
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

/**
 * Mongoose model for CharacterVectorStore.
 * @constant
 * @type {mongoose.Model<CharacterVectorStoreSchema>}
 */
const CharacterVectorStore = mongoose.model(
  "CharacterVectorStore",
  characterVectorStoreSchema
);

export default CharacterVectorStore;
