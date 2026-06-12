require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tukangRoutes = require("./routes/tukangRoutes");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tukang", tukangRoutes);

app.use("/api/booking", bookingRoutes);

module.exports = app;

console.log("authRoutes =", authRoutes);
console.log("tukangRoutes =", tukangRoutes);