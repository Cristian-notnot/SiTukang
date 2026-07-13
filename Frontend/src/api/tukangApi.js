import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

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