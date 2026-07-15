const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const verifyToken = require("../middleware/authMiddleware");

const {
    getDashboard, getBookingMasuk, getRiwayatPekerjaan,
    getReviewTukang, updateRatingTukang, getProfil, updateProfil
} = require("../controllers/dashbordTukangController");

const {
    getDashboard: getDashboardV2,
    getOrders, updateOrderStatus,
    getEarnings,
    getSchedule, getTodaySchedule,
    getPortfolio, addPortfolio, deletePortfolio,
    getBank, saveBank, requestWithdraw, getWithdrawHistory,
    getReviews,
    getNotifications, readNotification, readAllNotifications,
    getAvailability, saveAvailability, getLeaves,
    getProfile, updateProfile,
    getTips
} = require("../controllers/tukangDashboardController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads/portfolio")),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `portfolio-${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = allowed.test(file.mimetype.split("/")[1]);
        cb(null, extOk && mimeOk);
    }
});

// Existing routes
router.get("/", verifyToken, getDashboard);
router.get("/booking", verifyToken, getBookingMasuk);
router.get("/riwayat", verifyToken, getRiwayatPekerjaan);
router.get("/review", verifyToken, getReviewTukang);
router.put("/update-rating", verifyToken, updateRatingTukang);
router.get("/profil", verifyToken, getProfil);
router.put("/profil", verifyToken, updateProfil);

// New V2 routes
router.get("/v2/dashboard", verifyToken, getDashboardV2);
router.get("/v2/orders", verifyToken, getOrders);
router.put("/v2/orders/:id/status", verifyToken, updateOrderStatus);
router.get("/v2/earnings", verifyToken, getEarnings);
router.get("/v2/schedule", verifyToken, getSchedule);
router.get("/v2/schedule/today", verifyToken, getTodaySchedule);
router.get("/v2/portfolio", verifyToken, getPortfolio);
router.post("/v2/portfolio", verifyToken, upload.single("foto"), addPortfolio);
router.delete("/v2/portfolio/:id", verifyToken, deletePortfolio);
router.get("/v2/bank", verifyToken, getBank);
router.put("/v2/bank", verifyToken, saveBank);
router.post("/v2/withdraw", verifyToken, requestWithdraw);
router.get("/v2/withdraw/history", verifyToken, getWithdrawHistory);
router.get("/v2/reviews", verifyToken, getReviews);
router.get("/v2/notifications", verifyToken, getNotifications);
router.put("/v2/notifications/:id/read", verifyToken, readNotification);
router.put("/v2/notifications/read-all", verifyToken, readAllNotifications);
router.get("/v2/availability", verifyToken, getAvailability);
router.put("/v2/availability", verifyToken, saveAvailability);
router.get("/v2/leaves", verifyToken, getLeaves);
router.get("/v2/profile", verifyToken, getProfile);
router.put("/v2/profile", verifyToken, updateProfile);
router.get("/v2/tips", verifyToken, getTips);

module.exports = router;
