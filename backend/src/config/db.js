import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoURI);
    return { success: true, msg: connection };
  } catch (error) {
    return { success: false, msg: error };
  }
};

export default connectDB;
