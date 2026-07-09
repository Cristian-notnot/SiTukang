const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getDashboardAdmin,
    getPendingTukang,
    getAllTukang,
    approveTukang,
    rejectTukang,
    getAllBooking,
    getAllUsers,
    getAllReview
} = require("../controllers/adminController");

const adminOnly = [verifyToken, roleMiddleware("admin")];

router.get("/dashboard", ...adminOnly, getDashboardAdmin);
router.get("/tukang/pending", ...adminOnly, getPendingTukang);
router.get("/tukang", ...adminOnly, getAllTukang);
router.put("/tukang/:id/approve", ...adminOnly, approveTukang);
router.put("/tukang/:id/reject", ...adminOnly, rejectTukang);
router.get("/booking", ...adminOnly, getAllBooking);
router.get("/users", ...adminOnly, getAllUsers);
router.get("/review", ...adminOnly, getAllReview);

module.exports = router;