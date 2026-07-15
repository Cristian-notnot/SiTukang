import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const authMultipart = () => ({ headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } });

export const getAllTukang = async () => {
    const response = await API.get("/tukang");
    return response.data;
};

export const getRekomendasiTukang = async () => {
    const response = await API.get("/tukang/rekomendasi");
    return response.data;
};

export const getSearchTukang = async ({ keyword, alamat, kategori, sort } = {}) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (alamat) params.append("alamat", alamat);
    if (kategori) params.append("kategori", kategori);
    if (sort) params.append("sort", sort);
    const query = params.toString();
    const response = await API.get(`/tukang/search${query ? `?${query}` : ""}`);
    return response.data;
};

export const getDetailTukang = async (id) => {
    const response = await API.get(`/tukang/${id}`);
    return response.data;
};

export const getAllKategori = async () => {
    const response = await API.get("/tukang/kategori");
    return response.data;
};

// ─── V1 (existing) ───
export const getDashboardTukang = async () => {
    const response = await API.get("/dashbord-tukang/", auth());
    return response.data;
};

export const getRiwayatTukang = async (status) => {
    const params = status ? `?status=${status}` : "";
    const response = await API.get(`/dashbord-tukang/riwayat${params}`, auth());
    return response.data;
};

export const getReviewTukang = async () => {
    const response = await API.get("/dashbord-tukang/review", auth());
    return response.data;
};

export const getProfilTukang = async () => {
    const response = await API.get("/dashbord-tukang/profil", auth());
    return response.data;
};

export const updateProfilTukang = async (data) => {
    const response = await API.put("/dashbord-tukang/profil", data, auth());
    return response.data;
};

// ─── V2 Dashboard ───
export const getDashboardV2 = async () => {
    const response = await API.get("/dashbord-tukang/v2/dashboard", auth());
    return response.data;
};

export const getOrders = async (status) => {
    const params = status ? `?status=${status}` : "";
    const response = await API.get(`/dashbord-tukang/v2/orders${params}`, auth());
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await API.put(`/dashbord-tukang/v2/orders/${id}/status`, { status }, auth());
    return response.data;
};

export const getEarnings = async () => {
    const response = await API.get("/dashbord-tukang/v2/earnings", auth());
    return response.data;
};

export const getSchedule = async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year);
    const query = params.toString();
    const response = await API.get(`/dashbord-tukang/v2/schedule${query ? `?${query}` : ""}`, auth());
    return response.data;
};

export const getTodaySchedule = async () => {
    const response = await API.get("/dashbord-tukang/v2/schedule/today", auth());
    return response.data;
};

export const getPortfolio = async () => {
    const response = await API.get("/dashbord-tukang/v2/portfolio", auth());
    return response.data;
};

export const addPortfolio = async (formData) => {
    const response = await API.post("/dashbord-tukang/v2/portfolio", formData, authMultipart());
    return response.data;
};

export const deletePortfolio = async (id) => {
    const response = await API.delete(`/dashbord-tukang/v2/portfolio/${id}`, auth());
    return response.data;
};

export const getBank = async () => {
    const response = await API.get("/dashbord-tukang/v2/bank", auth());
    return response.data;
};

export const saveBank = async (data) => {
    const response = await API.put("/dashbord-tukang/v2/bank", data, auth());
    return response.data;
};

export const requestWithdraw = async (jumlah) => {
    const response = await API.post("/dashbord-tukang/v2/withdraw", { jumlah }, auth());
    return response.data;
};

export const getWithdrawHistory = async () => {
    const response = await API.get("/dashbord-tukang/v2/withdraw/history", auth());
    return response.data;
};

export const getReviewsV2 = async () => {
    const response = await API.get("/dashbord-tukang/v2/reviews", auth());
    return response.data;
};

export const getNotifications = async () => {
    const response = await API.get("/dashbord-tukang/v2/notifications", auth());
    return response.data;
};

export const readNotification = async (id) => {
    const response = await API.put(`/dashbord-tukang/v2/notifications/${id}/read`, {}, auth());
    return response.data;
};

export const readAllNotifications = async () => {
    const response = await API.put("/dashbord-tukang/v2/notifications/read-all", {}, auth());
    return response.data;
};

export const getAvailability = async () => {
    const response = await API.get("/dashbord-tukang/v2/availability", auth());
    return response.data;
};

export const saveAvailability = async (data) => {
    const response = await API.put("/dashbord-tukang/v2/availability", data, auth());
    return response.data;
};

export const getLeaves = async () => {
    const response = await API.get("/dashbord-tukang/v2/leaves", auth());
    return response.data;
};

export const getProfileV2 = async () => {
    const response = await API.get("/dashbord-tukang/v2/profile", auth());
    return response.data;
};

export const updateProfileV2 = async (data) => {
    const response = await API.put("/dashbord-tukang/v2/profile", data, auth());
    return response.data;
};

export const getTips = async () => {
    const response = await API.get("/dashbord-tukang/v2/tips", auth());
    return response.data;
};
