import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testMongoConnection = async () => {
  try {
    console.log("🧠 Testing MongoDB Connection...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // 15 seconds timeout
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!");
    console.error("Error message:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Connection closed");
  }
};

testMongoConnection();
