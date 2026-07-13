const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getDashboardAdmin, getDashboardStats, getDashboardCharts,
    getAllUsers, getUserById, updateUser, deleteUser, updateUserRole,
    getPendingTukang, getAllTukang, getTukangById, updateTukang, approveTukang, rejectTukang, deleteTukang,
    getAllBooking, getBookingById, updateBookingStatus, deleteBooking, getBookingStats,
    getAllReview, moderateReview, deleteReview,
    getAllKategori, createKategori, updateKategori, deleteKategori,
    getMonthlyBooking, getTukangPerKategori,
    getAllTicket, updateTicketStatus,
    getAllPembayaran, updatePembayaranStatus,
    getAllKomisi,
    getLaporan,
    getLaporanPendapatan, getLaporanTukang, getLaporanCustomer, getLaporanPembayaran, getLaporanKategori, getLaporanWilayah,
    getRecentBooking, getRecentUsers,
    getPengaturan, updatePengaturan,
    getAdminProfile, updateAdminProfile
} = require("../controllers/adminController");

const adminOnly = [verifyToken, roleMiddleware("admin")];

// Dashboard
router.get("/dashboard", ...adminOnly, getDashboardAdmin);
router.get("/dashboard/stats", ...adminOnly, getDashboardStats);
router.get("/dashboard/charts", ...adminOnly, getDashboardCharts);
router.get("/dashboard/recent-booking", ...adminOnly, getRecentBooking);
router.get("/dashboard/recent-users", ...adminOnly, getRecentUsers);

// Users
router.get("/users", ...adminOnly, getAllUsers);
router.get("/users/:id", ...adminOnly, getUserById);
router.put("/users/:id", ...adminOnly, updateUser);
router.put("/users/:id/role", ...adminOnly, updateUserRole);
router.delete("/users/:id", ...adminOnly, deleteUser);

// Tukang
router.get("/tukang/pending", ...adminOnly, getPendingTukang);
router.get("/tukang", ...adminOnly, getAllTukang);
router.get("/tukang/:id", ...adminOnly, getTukangById);
router.post("/tukang", ...adminOnly, (req, res) => res.status(501).json({ success: false, message: "Belum diimplementasi" }));
router.put("/tukang/:id", ...adminOnly, updateTukang);
router.put("/tukang/:id/approve", ...adminOnly, approveTukang);
router.put("/tukang/:id/reject", ...adminOnly, rejectTukang);
router.delete("/tukang/:id", ...adminOnly, deleteTukang);

// Booking
router.get("/booking", ...adminOnly, getAllBooking);
router.get("/booking/:id", ...adminOnly, getBookingById);
router.get("/booking/stats", ...adminOnly, getBookingStats);
router.put("/booking/:id/status", ...adminOnly, updateBookingStatus);
router.delete("/booking/:id", ...adminOnly, deleteBooking);

// Review
router.get("/review", ...adminOnly, getAllReview);
router.put("/review/:id/moderasi", ...adminOnly, moderateReview);
router.delete("/review/:id", ...adminOnly, deleteReview);

// Kategori
router.get("/kategori", ...adminOnly, getAllKategori);
router.post("/kategori", ...adminOnly, createKategori);
router.put("/kategori/:id", ...adminOnly, updateKategori);
router.delete("/kategori/:id", ...adminOnly, deleteKategori);

// Chart
router.get("/chart/monthly-booking", ...adminOnly, getMonthlyBooking);
router.get("/chart/tukang-per-kategori", ...adminOnly, getTukangPerKategori);

// Pembayaran & Komisi
router.get("/pembayaran", ...adminOnly, getAllPembayaran);
router.put("/pembayaran/:id/status", ...adminOnly, updatePembayaranStatus);
router.get("/komisi", ...adminOnly, getAllKomisi);

// Laporan
router.get("/laporan", ...adminOnly, getLaporan);
router.get("/laporan/pendapatan", ...adminOnly, getLaporanPendapatan);
router.get("/laporan/tukang", ...adminOnly, getLaporanTukang);
router.get("/laporan/customer", ...adminOnly, getLaporanCustomer);
router.get("/laporan/pembayaran", ...adminOnly, getLaporanPembayaran);
router.get("/laporan/kategori", ...adminOnly, getLaporanKategori);
router.get("/laporan/wilayah", ...adminOnly, getLaporanWilayah);

// Ticket Support
router.get("/ticket", ...adminOnly, getAllTicket);
router.put("/ticket/:id/status", ...adminOnly, updateTicketStatus);

// Pengaturan & Profil
router.get("/pengaturan", ...adminOnly, getPengaturan);
router.put("/pengaturan", ...adminOnly, updatePengaturan);
router.get("/profil", ...adminOnly, getAdminProfile);
router.put("/profil", ...adminOnly, updateAdminProfile);

module.exports = router;