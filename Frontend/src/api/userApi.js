import API from "./axios";

const getToken = () => localStorage.getItem("token");
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const getProfile = async () => {
    const response = await API.get("/auth/profile", auth());
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await API.put("/auth/profile", data, auth());
    return response.data;
};

export const uploadProfilePhoto = async (formData) => {
    const response = await API.put("/auth/profile/photo", formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
