const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createBooking,
    getMyBooking,
    getMyBookingSelesai,
    updateBookingStatus,
    cancelBooking
} = require("../controllers/bookingController");

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getMyBooking);
router.get("/my/selesai", verifyToken, getMyBookingSelesai);
router.put("/:id/status", verifyToken, updateBookingStatus);
router.put("/:id/cancel", verifyToken, cancelBooking);

module.exports = router;