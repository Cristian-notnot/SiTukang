const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createReview,
    getReviewByBooking,
    getMyReviews,
    getReviewByTukangId
} = require("../controllers/reviewController");

router.post("/", verifyToken, createReview);
router.get("/my", verifyToken, getMyReviews);
router.get("/booking/:booking_id", verifyToken, getReviewByBooking);
router.get("/tukang/:tukang_id", getReviewByTukangId);

module.exports = router;