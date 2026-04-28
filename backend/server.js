//untuk memastikan server jalan terlebih dahulu
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend jalan!");
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});