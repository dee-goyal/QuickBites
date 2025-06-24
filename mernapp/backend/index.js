require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");

// Non-blocking DB connection
mongoDB().then(connected => {
  console.log(connected ? "DB connected" : "DB connection failed");
});

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Simple health check
app.get("/", (req, res) => {
  res.json({ 
    status: "running",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Your routes
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});