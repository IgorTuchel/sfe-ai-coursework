/**
 * @file db.js
 * @description Database connection configuration using Mongoose.
 * Establishes a connection to the MongoDB database.
 * @module config/db
 */

import mongoose from "mongoose";
import config from "./config.js";

/**
 * Connects to the MongoDB database using Mongoose.
 * @function connectDB
 * @async
 * @description Establishes a connection to the MongoDB database defined in the config.
 * Handles connection errors gracefully by returning a status object rather than throwing.
 * @returns {Promise<{success: boolean, msg: typeof mongoose | Error}>} Result object containing success status and either the connection instance or error object.
 * @example
 * const status = await connectDB();
 * if (status.success) {
 * console.log("Connected!");
 * }
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoURI);
    return { success: true, msg: connection };
  } catch (error) {
    return { success: false, msg: error };
  }
};

export default connectDB;
