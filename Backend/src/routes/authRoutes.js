const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile
} = require("../controllers/authController");

router.get(
    "/profile",
    verifyToken,
    getProfile
);

router.post("/register", register);
router.post("/login", login);

module.exports = router;