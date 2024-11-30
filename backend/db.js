const mongoose = require('mongoose');

// Updated MongoDB connection URI
const mongoURI = 'mongodb+srv://QuickBites:deepi1205@cluster0.u6hkh.mongodb.net/QuickBitesmern';

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
        const fetched_data = mongoose.connection.db.collection("items");
        const data = await fetched_data.find({}).toArray();
        
        console.log(data);
    } catch (error) {
        console.error("Error connecting to MongoDB or fetching data:", error.message);
    }
};

module.exports = mongoDB;
