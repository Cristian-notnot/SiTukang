const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createBooking,
    getMyBooking,
    updateBookingStatus
} = require("../controllers/bookingController");

router.post(
    "/",
    verifyToken,
    createBooking
);

router.get(
    "/my",
    verifyToken,
    getMyBooking
);

router.put(
    "/:id/status",
    verifyToken,
    updateBookingStatus
);

router.get("/:id", verifyToken, getMyBooking);

module.exports = router;