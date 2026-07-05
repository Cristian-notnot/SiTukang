const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getBookingMasuk
} = require("../controller/dashboardTukangController");

// Booking yang masuk untuk tukang yang sedang login
router.get(
    "/booking",
    verifyToken,
    getBookingMasuk
);

module.exports = router;