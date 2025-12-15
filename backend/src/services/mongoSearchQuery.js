/**
 * @file mongoSearchQuery.js
 * @description Service for performing hybrid search using vector similarity and keyword matching.
 * Combines MongoDB Atlas Vector Search and Text Search with Reciprocal Rank Fusion (RRF) scoring
 * to retrieve relevant character knowledge base documents.
 * @module services/mongoSearchQuery
 */

import mongoose from "mongoose";
import cfg from "../config/config.js";
import CharacterVectorStore from "../models/characterVectorDataStore.js";

/**
 * Performs hybrid search combining vector similarity and keyword matching with RRF scoring.
 *
 * @async
 * @param {string} characterID - The unique identifier of the character whose knowledge base to search.
 * @param {string} queryText - The text query for keyword-based search.
 * @param {number[]} queryVector - The embedding vector for semantic similarity search.
 * @returns {Promise<Array<Object>>} Array of ranked search results with combined scores.
 * @returns {Object} result - Individual search result.
 * @returns {mongoose.Types.ObjectId} result._id - Document ID.
 * @returns {string} result.text - The retrieved text content.
 * @returns {mongoose.Types.ObjectId} result.characterID - Character ID the document belongs to.
 * @returns {number} result.vs_score - Vector search score (RRF normalized).
 * @returns {number} result.text_score - Keyword search score (RRF normalized).
 * @returns {number} result.final_score - Combined score from both search methods.
 *
 * @description Implements a hybrid search strategy using MongoDB Atlas:
 * 1. Vector Search: Finds semantically similar documents using embedding vectors (top 20 from 100 candidates)
 * 2. Keyword Search: Finds documents matching query text using full-text search (top 20)
 * 3. RRF Fusion: Combines results using Reciprocal Rank Fusion scoring (1 / (rank + k))
 * 4. Returns top N results sorted by combined score (limit from cfg.ragMaxRetrieve)
 *
 * Both search methods filter by characterID to ensure only relevant character knowledge is retrieved.
 *
 * @example
 * const results = await mongoSearchQuery(
 *   "507f1f77bcf86cd799439011",
 *   "world war enigma machine",
 *   [0.123, -0.456, 0.789, ...] // 768-dimensional vector
 * );
 * console.log(results[0].text); // Most relevant document text
 * console.log(results[0].final_score); // Combined relevance score
 */
export async function mongoSearchQuery(characterID, queryText, queryVector) {
  const charObjectId = new mongoose.Types.ObjectId(characterID);
  const res = await CharacterVectorStore.aggregate([
    // vector search
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryVector,
        numCandidates: 100,
        limit: 20,
        filter: {
          characterID: { $eq: charObjectId },
        },
      },
    },
    {
      $group: {
        _id: null,
        docs: { $push: "$$ROOT" },
      },
    },
    {
      $unwind: {
        path: "$docs",
        includeArrayIndex: "rank",
      },
    },
    {
      $addFields: {
        vs_score: {
          $divide: [1.0, { $add: ["$rank", parseInt(cfg.rrfScore)] }],
        },
      },
    },
    {
      $project: {
        vs_score: 1,
        _id: "$docs._id",
        text: "$docs.text",
        characterID: "$docs.characterID",
      },
    },
    // keyword search
    {
      $unionWith: {
        coll: "charactervectorstores",
        pipeline: [
          {
            $search: {
              index: "default",
              text: {
                query: queryText,
                path: ["text"],
              },
            },
          },
          {
            $match: {
              characterID: charObjectId,
            },
          },
          {
            $limit: 20,
          },
          {
            $group: {
              _id: null,
              docs: { $push: "$$ROOT" },
            },
          },
          {
            $unwind: {
              path: "$docs",
              includeArrayIndex: "rank",
            },
          },
          {
            $addFields: {
              text_score: {
                $divide: [1.0, { $add: ["$rank", parseInt(cfg.rrfScore)] }],
              },
            },
          },
          {
            $project: {
              text_score: 1,
              _id: "$docs._id",
              text: "$docs.text",
              characterID: "$docs.characterID",
            },
          },
        ],
      },
    },
    // combine + score
    {
      $group: {
        _id: "$_id",
        text: { $first: "$text" },
        characterID: { $first: "$characterID" },
        vs_score: { $max: "$vs_score" },
        text_score: { $max: "$text_score" },
      },
    },
    {
      $project: {
        _id: 1,
        text: 1,
        characterID: 1,
        vs_score: { $ifNull: ["$vs_score", 0] },
        text_score: { $ifNull: ["$text_score", 0] },
        final_score: {
          $add: [
            { $ifNull: ["$vs_score", 0] },
            { $ifNull: ["$text_score", 0] },
          ],
        },
      },
    },
    {
      $sort: { final_score: -1 },
    },
    {
      $limit: parseInt(cfg.ragMaxRetrieve),
    },
  ]);

  return res;
}
