const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDashboard,
    getBookingMasuk,
    getRiwayatPekerjaan,
    getReviewTukang,
    updateRatingTukang,
    getProfil,
    updateProfil
} = require("../controllers/dashbordTukangController");

router.get("/", verifyToken, getDashboard);
router.get("/booking", verifyToken, getBookingMasuk);
router.get("/riwayat", verifyToken, getRiwayatPekerjaan);
router.get("/review", verifyToken, getReviewTukang);
router.put("/update-rating", verifyToken, updateRatingTukang);
router.get("/profil", verifyToken, getProfil);
router.put("/profil", verifyToken, updateProfil);

module.exports = router;