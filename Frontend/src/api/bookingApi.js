import API from "./axios";

export const createBooking = async (data) => {

    const token = localStorage.getItem("token");

    const response = await API.post(
        "/booking",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};

export const getMyBooking = async () => {

    const token = localStorage.getItem("token");

    const response = await API.get(
        "/booking/my",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};