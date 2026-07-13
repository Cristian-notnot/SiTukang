import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

// Dashboard
export const getAdminDashboard = async () => {
    const response = await API.get("/admin/dashboard", auth());
    return response.data;
};
export const getAdminStats = async () => {
    const response = await API.get("/admin/dashboard/stats", auth());
    return response.data;
};
export const getDashboardCharts = async () => {
    const response = await API.get("/admin/dashboard/charts", auth());
    return response.data;
};
export const getRecentBooking = async () => {
    const response = await API.get("/admin/dashboard/recent-booking", auth());
    return response.data;
};
export const getRecentUsers = async () => {
    const response = await API.get("/admin/dashboard/recent-users", auth());
    return response.data;
};

// Users
export const getAllUsersAdmin = async (params) => {
    const response = await API.get("/admin/users", { ...auth(), params });
    return response.data;
};
export const getUserById = async (id) => {
    const response = await API.get(`/admin/users/${id}`, auth());
    return response.data;
};
export const updateUser = async (id, data) => {
    const response = await API.put(`/admin/users/${id}`, data, auth());
    return response.data;
};
export const deleteUserAdmin = async (id) => {
    const response = await API.delete(`/admin/users/${id}`, auth());
    return response.data;
};
export const updateUserRole = async (id, role) => {
    const response = await API.put(`/admin/users/${id}/role`, { role }, auth());
    return response.data;
};

// Tukang
export const getPendingTukang = async () => {
    const response = await API.get("/admin/tukang/pending", auth());
    return response.data;
};
export const getAllTukangAdmin = async (params) => {
    const response = await API.get("/admin/tukang", { ...auth(), params });
    return response.data;
};
export const getTukangById = async (id) => {
    const response = await API.get(`/admin/tukang/${id}`, auth());
    return response.data;
};
export const approveTukang = async (id) => {
    const response = await API.put(`/admin/tukang/${id}/approve`, {}, auth());
    return response.data;
};
export const rejectTukang = async (id) => {
    const response = await API.put(`/admin/tukang/${id}/reject`, {}, auth());
    return response.data;
};
export const deleteTukangAdmin = async (id) => {
    const response = await API.delete(`/admin/tukang/${id}`, auth());
    return response.data;
};

// Booking
export const getAllBookingAdmin = async (params) => {
    const response = await API.get("/admin/booking", { ...auth(), params });
    return response.data;
};
export const getBookingById = async (id) => {
    const response = await API.get(`/admin/booking/${id}`, auth());
    return response.data;
};
export const getBookingStats = async () => {
    const response = await API.get("/admin/booking/stats", auth());
    return response.data;
};
export const updateBookingStatus = async (id, status) => {
    const response = await API.put(`/admin/booking/${id}/status`, { status }, auth());
    return response.data;
};
export const deleteBookingAdmin = async (id) => {
    const response = await API.delete(`/admin/booking/${id}`, auth());
    return response.data;
};

// Review
export const getAllReviewAdmin = async (params) => {
    const response = await API.get("/admin/review", { ...auth(), params });
    return response.data;
};
export const moderateReview = async (id, status) => {
    const response = await API.put(`/admin/review/${id}/moderasi`, { status }, auth());
    return response.data;
};
export const deleteReviewAdmin = async (id) => {
    const response = await API.delete(`/admin/review/${id}`, auth());
    return response.data;
};

// Kategori
export const getAllKategori = async () => {
    const response = await API.get("/admin/kategori", auth());
    return response.data;
};
export const createKategori = async (nama_kategori) => {
    const response = await API.post("/admin/kategori", { nama_kategori }, auth());
    return response.data;
};
export const updateKategori = async (id, nama_kategori) => {
    const response = await API.put(`/admin/kategori/${id}`, { nama_kategori }, auth());
    return response.data;
};
export const deleteKategori = async (id) => {
    const response = await API.delete(`/admin/kategori/${id}`, auth());
    return response.data;
};

// Chart
export const getMonthlyBooking = async () => {
    const response = await API.get("/admin/chart/monthly-booking", auth());
    return response.data;
};
export const getTukangPerKategori = async () => {
    const response = await API.get("/admin/chart/tukang-per-kategori", auth());
    return response.data;
};

// Pembayaran & Komisi
export const getAllPembayaran = async () => {
    const response = await API.get("/admin/pembayaran", auth());
    return response.data;
};
export const updatePembayaranStatus = async (id, status) => {
    const response = await API.put(`/admin/pembayaran/${id}/status`, { status }, auth());
    return response.data;
};
export const getAllKomisi = async () => {
    const response = await API.get("/admin/komisi", auth());
    return response.data;
};

// Ticket
export const getAllTicket = async () => {
    const response = await API.get("/admin/ticket", auth());
    return response.data;
};
export const updateTicketStatus = async (id, status) => {
    const response = await API.put(`/admin/ticket/${id}/status`, { status }, auth());
    return response.data;
};

// Laporan
export const getLaporan = async () => {
    const response = await API.get("/admin/laporan", auth());
    return response.data;
};
export const getLaporanPendapatan = async () => {
    const response = await API.get("/admin/laporan/pendapatan", auth());
    return response.data;
};
export const getLaporanTukang = async () => {
    const response = await API.get("/admin/laporan/tukang", auth());
    return response.data;
};
export const getLaporanCustomer = async () => {
    const response = await API.get("/admin/laporan/customer", auth());
    return response.data;
};
export const getLaporanPembayaran = async () => {
    const response = await API.get("/admin/laporan/pembayaran", auth());
    return response.data;
};
export const getLaporanKategori = async () => {
    const response = await API.get("/admin/laporan/kategori", auth());
    return response.data;
};
export const getLaporanWilayah = async () => {
    const response = await API.get("/admin/laporan/wilayah", auth());
    return response.data;
};

// Pengaturan & Profil
export const getPengaturan = async () => {
    const response = await API.get("/admin/pengaturan", auth());
    return response.data;
};
export const updatePengaturan = async (data) => {
    const response = await API.put("/admin/pengaturan", data, auth());
    return response.data;
};
export const getAdminProfile = async () => {
    const response = await API.get("/admin/profil", auth());
    return response.data;
};
export const updateAdminProfile = async (data) => {
    const response = await API.put("/admin/profil", data, auth());
    return response.data;
};