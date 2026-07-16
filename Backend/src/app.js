require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tukangRoutes = require("./routes/tukangRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashbordTukangRoutes = require("./routes/dashbordTukangRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tukang", tukangRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashbord-tukang", dashbordTukangRoutes);
app.use("/api/payment", paymentRoutes);


module.exports = app;

console.log("authRoutes =", authRoutes);
console.log("tukangRoutes =", tukangRoutes);