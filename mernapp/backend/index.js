require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");

console.log("Starting the application...");

// Async DB connection with error handling
mongoDB().catch(err => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Routes
app.get("/", (req, res) => res.json({ 
  status: "running",
  db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
}));

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error' });
});

// Server start with error handling
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});