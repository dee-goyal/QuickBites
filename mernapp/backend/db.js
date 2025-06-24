require('dotenv').config();
const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  // Added timeout
      retryWrites: true,
      w: "majority"
    });

    console.log("MongoDB connected successfully");
    
    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not established");
    }

    // Fetch data
    global.items = await mongoose.connection.db.collection("items").find({}).toArray();
    global.category = await mongoose.connection.db.collection("category").find({}).toArray();

  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error; // Important for Vercel to catch failures
  }
};

module.exports = mongoDB;