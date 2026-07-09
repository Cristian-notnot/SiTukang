import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const createReview = async (data) => {
    const response = await API.post("/reviews", data, auth());
    return response.data;
};

export const getMyReviews = async () => {
    const response = await API.get("/reviews/my", auth());
    return response.data;
};

export const getReviewByBooking = async (bookingId) => {
    const response = await API.get(`/reviews/booking/${bookingId}`, auth());
    return response.data;
};

export const getReviewByTukangId = async (tukangId) => {
    const response = await API.get(`/reviews/tukang/${tukangId}`);
    return response.data;
};