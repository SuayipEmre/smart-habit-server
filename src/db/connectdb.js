import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";




console.log("connectdb.js MONGO_URI:", MONGO_URI);

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}


export const connectDB = async() => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB :" + MONGO_URI);    
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}