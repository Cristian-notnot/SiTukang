const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  getWallet,
  getTransactions,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  payBooking
} = require("../controllers/paymentController");

router.get("/wallet", verifyToken, getWallet);
router.get("/transactions", verifyToken, getTransactions);
router.get("/methods", verifyToken, getPaymentMethods);
router.post("/methods", verifyToken, addPaymentMethod);
router.delete("/methods/:id", verifyToken, deletePaymentMethod);
router.put("/methods/:id/default", verifyToken, setDefaultPaymentMethod);
router.post("/pay-booking", verifyToken, payBooking);

module.exports = router;
