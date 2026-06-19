const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getDashboardStats
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    verifyToken,
    roleMiddleware("admin"),
    getDashboardStats
);

module.exports = router;