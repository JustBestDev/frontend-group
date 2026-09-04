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

export const createPropertyApi = async (propertyData) => {
    const res = await api.post("/properties", propertyData);
    return res.data;
};

export const createPropertyAddressApi = async (propertyId, addressData) => {
    const res = await api.post(`/properties/${propertyId}/address`, addressData);
    return res.data;
};

export const uploadPropertyImagesApi = async (propertyId, images) => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    const res = await api.post(`/properties/${propertyId}/images`, formData);
    return res.data;
};

export const createPropertyRoomApi = async (propertyId, roomData) => {
    const res = await api.post(`/properties/${propertyId}/rooms`, roomData);
    return res.data;
};
