const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

const {
  getAllTukang,
  getDetailTukang,
  registerTukang,
  getBookingTukang,
  updateStatusBooking,
  getDashboardTukang
} = require("../controllers/tukangController");

router.get("/", getAllTukang);
router.get(
    "/booking",
    verifyToken,
    getBookingTukang
);

router.put(
    "/booking/:id/status",
    verifyToken,
    updateStatusBooking
);

router.get(
    "/dashboard",
    verifyToken,
    getDashboardTukang
);

router.get("/:id", getDetailTukang);

router.post(
    "/register",
    verifyToken,
    registerTukang
);


module.exports = router;