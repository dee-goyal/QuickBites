const express = require("express");
const app = express();
const port = 5000;
const mongoDB = require("./db");

console.log("Global items:", global.items);
console.log("Global categories:", global.category);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

console.log("Starting the application...");
mongoDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use("/api", require("./routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/OrderData"));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
