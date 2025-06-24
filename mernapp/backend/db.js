require('dotenv').config();
const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000, // 3 seconds timeout
      retryWrites: true
    });

    console.log("MongoDB connection successful!");
    
    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Connection established but readyState not 1");
    }

    // Fetch initial data
    global.items = await mongoose.connection.db.collection("items").find({}).toArray();
    global.category = await mongoose.connection.db.collection("category").find({}).toArray();

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error; // This ensures Vercel shows the error
  }
};

module.exports = mongoDB;