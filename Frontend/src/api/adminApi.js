import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const getAdminDashboard = async () => {
    const response = await API.get("/admin/dashboard", auth());
    return response.data;
};

export const getPendingTukang = async () => {
    const response = await API.get("/admin/tukang/pending", auth());
    return response.data;
};

export const getAllTukangAdmin = async () => {
    const response = await API.get("/admin/tukang", auth());
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

export const getAllBookingAdmin = async () => {
    const response = await API.get("/admin/booking", auth());
    return response.data;
};

export const getAllUsersAdmin = async () => {
    const response = await API.get("/admin/users", auth());
    return response.data;
};

export const getAllReviewAdmin = async () => {
    const response = await API.get("/admin/review", auth());
    return response.data;
};