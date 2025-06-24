require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");

console.log("Starting the application...");
mongoDB();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api", require("./routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
