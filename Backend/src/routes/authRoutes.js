const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  register,
  login,
  registerTukang,
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
router.post("/register-tukang", registerTukang);
router.post("/login", login);

module.exports = router;