import api from "./api.js";

export const getMyProfileApi = async () => {
    const res = await api.get("/profiles/me");
    return res.data;
};

export const updateMyProfileApi = async (profileData) => {
    const res = await api.patch("/profiles/me", profileData);
    return res.data;
};

export const getMyPropertiesApi = async () => {
    const res = await api.get("/properties/me");
    return res.data;
};

export const getMyRentalsApi = async (params = {}) => {
    const res = await api.get("/rentals/me", { params });
    return res.data;
};
