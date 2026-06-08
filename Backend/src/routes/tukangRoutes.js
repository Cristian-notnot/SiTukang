const express = require("express");

const router = express.Router();

const {
  getAllTukang,
  getDetailTukang
} = require("../controllers/tukangController");

router.get("/", getAllTukang);
router.get("/:id", getDetailTukang);

module.exports = router;