const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createReview
} = require("../controllers/reviewController");

router.post(
    "/",
    verifyToken,
    createReview
);

module.exports = router;