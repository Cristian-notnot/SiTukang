import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const createBooking = async (data) => {
    const response = await API.post("/booking", data, auth());
    return response;
};

export const getMyBooking = async () => {
    const response = await API.get("/booking/my", auth());
    return response.data;
};

export const getMyBookingSelesai = async () => {
    const response = await API.get("/booking/my/selesai", auth());
    return response.data;
};

export const getBookingById = async (id) => {
    const response = await API.get(`/booking/${id}`, auth());
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await API.put(`/booking/${id}/cancel`, {}, auth());
    return response.data;
};