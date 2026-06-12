const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createBooking
} = require("../controllers/bookingController");

router.post(
    "/",
    verifyToken,
    createBooking
);

module.exports = router;