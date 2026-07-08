const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile,
  resetPassword
} = require("../controllers/authController");

router.get(
    "/profile",
    verifyToken,
    getProfile
);

router.put(
    "/reset-password/:id",
    resetPassword
);

router.post("/register", register);
router.post("/login", login);

module.exports = router;