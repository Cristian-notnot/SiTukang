const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

const {
  getAllTukang,
  getDetailTukang,
  registerTukang
} = require("../controllers/tukangController");

router.get("/", getAllTukang);
router.get("/:id", getDetailTukang);

router.post(
    "/register",
    verifyToken,
    registerTukang
);

module.exports = router;