import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

// ─── Midtrans Payment API ───

export const createPayment = async (bookingId) => {
    const response = await API.post("/payment/create", { booking_id: bookingId }, auth());
    return response.data;
};

export const getMyPayments = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append("status", params.status);
    if (params.limit) query.append("limit", params.limit);
    if (params.offset) query.append("offset", params.offset);
    const qs = query.toString();
    const response = await API.get(`/payment/my${qs ? `?${qs}` : ""}`, auth());
    return response.data;
};

export const getPaymentByBooking = async (bookingId) => {
    const response = await API.get(`/payment/booking/${bookingId}`, auth());
    return response.data;
};

export const getPaymentByInvoice = async (invoiceNumber) => {
    const response = await API.get(`/payment/invoice/${invoiceNumber}`, auth());
    return response.data;
};

// ─── Legacy Wallet API (backward compatibility) ───

export const getWallet = async () => {
    const response = await API.get("/payment/wallet", auth());
    return response.data;
};

export const topUp = async (jumlah, metode) => {
    const response = await API.post("/payment/topup", { jumlah, metode }, auth());
    return response.data;
};

export const getTransactions = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.tipe) query.append("tipe", params.tipe);
    if (params.limit) query.append("limit", params.limit);
    if (params.offset) query.append("offset", params.offset);
    const qs = query.toString();
    const response = await API.get(`/payment/transactions${qs ? `?${qs}` : ""}`, auth());
    return response.data;
};

export const getPaymentMethods = async () => {
    const response = await API.get("/payment/methods", auth());
    return response.data;
};

export const addPaymentMethod = async (data) => {
    const response = await API.post("/payment/methods", data, auth());
    return response.data;
};

export const deletePaymentMethod = async (id) => {
    const response = await API.delete(`/payment/methods/${id}`, auth());
    return response.data;
};

export const setDefaultPaymentMethod = async (id) => {
    const response = await API.put(`/payment/methods/${id}/default`, {}, auth());
    return response.data;
};

export const payBooking = async (booking_id, jumlah, metode = "qris") => {
    const response = await API.post("/payment/pay-booking", { booking_id, jumlah, metode }, auth());
    return response.data;
};
