require("dotenv").config();
const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return false;
  }
};

module.exports = mongoDB;