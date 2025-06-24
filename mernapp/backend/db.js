require('dotenv').config();
const mongoose = require("mongoose");

// Updated MongoDB connection URI
const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Connect to MongoDB with updated URI and options
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");

    // Accessing the 'items' collection and fetching data
    const fetched_data = await mongoose.connection.db.collection("items").find({}).toArray();
    
    // Fetching data from the 'category' collection
    const category = await mongoose.connection.db.collection("category").find({}).toArray();
    
    // Storing data in global variables
    global.items = fetched_data;
    global.category = category;

    console.log(global.items);

  } catch (error) {
    console.error(
      "Error connecting to MongoDB or fetching data:",
      error.message
    );
  }
};

module.exports = mongoDB;