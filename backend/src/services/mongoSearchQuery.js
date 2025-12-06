import mongoose from "mongoose";
import cfg from "../config/config.js";
import CharacterVectorStore from "../models/characterVectorDataStore.js";

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
