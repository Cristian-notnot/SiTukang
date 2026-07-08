import API from "./axios";

export const getAllTukang = async () => {

    const response = await API.get("/tukang");

    return response.data;

};

export const getSearchTukang = async (keyword, alamat) => {

    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);

    if (alamat) params.append("alamat", alamat);

    const query = params.toString();

    const response = await API.get(`/tukang/search${query ? `?${query}` : ""}`);

    return response.data;

};

export const getDetailTukang = async (id) => {

    const response = await API.get(`/tukang/${id}`);

    return response.data;

};
