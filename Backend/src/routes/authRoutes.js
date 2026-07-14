const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads/profile")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|bmp|svg|tiff|tif|ico|avif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split("/")[1]);
    cb(null, extOk && mimeOk);
  }
});

const {
  register,
  login,
  registerTukang,
  getProfile,
  updateProfile,
  uploadPhoto,
  resetPassword
} = require("../controllers/authController");

router.get(
    "/profile",
    verifyToken,
    getProfile
);

router.put(
    "/profile",
    verifyToken,
    updateProfile
);

router.put(
    "/reset-password/:id",
    resetPassword
);

router.put(
    "/profile/photo",
    verifyToken,
    upload.single("foto"),
    uploadPhoto
);

router.post("/register", register);
router.post("/register-tukang", registerTukang);
router.post("/login", login);

module.exports = router;