const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    createPayment,
    getPaymentByBooking,
    getPaymentByInvoice,
    getMyPayments,
    getAllPayments,
    handleMidtransWebhook,
    getWallet,
    getTransactions,
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    payBooking,
} = require("../controllers/paymentController");

// Midtrans Payment Routes
router.post("/create", verifyToken, createPayment);
router.get("/my", verifyToken, getMyPayments);
router.get("/booking/:bookingId", verifyToken, getPaymentByBooking);
router.get("/invoice/:invoiceNumber", verifyToken, getPaymentByInvoice);
router.get("/admin/all", verifyToken, roleMiddleware("admin"), getAllPayments);

// Legacy Wallet Routes (backward compatibility)
router.get("/wallet", verifyToken, getWallet);
router.get("/transactions", verifyToken, getTransactions);
router.get("/methods", verifyToken, getPaymentMethods);
router.post("/methods", verifyToken, addPaymentMethod);
router.delete("/methods/:id", verifyToken, deletePaymentMethod);
router.put("/methods/:id/default", verifyToken, setDefaultPaymentMethod);
router.post("/pay-booking", verifyToken, payBooking);

module.exports = router;
