import API from "./axios";

export const getAllTukang = async () => {

    const response = await API.get("/tukang");

    return response.data;

};

export const getDetailTukang = async (id) => {

    const response = await API.get(`/tukang/${id}`);

    return response.data;

};