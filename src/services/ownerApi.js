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

export const getOwnerPropertyApi = async (propertyId) => {
    const res = await api.get(`/properties/${propertyId}`);
    return res.data;
};

export const getAmenitiesApi = async () => {
    const res = await api.get("/amenities");
    return res.data;
};

export const getHouseRulesApi = async () => {
    const res = await api.get("/house-rules");
    return res.data;
};

export const updatePropertyApi = async (propertyId, propertyData) => {
    const res = await api.patch(`/properties/${propertyId}`, propertyData);
    return res.data;
};

export const updatePropertyAddressApi = async (propertyId, addressData) => {
    const res = await api.patch(`/properties/${propertyId}/address`, addressData);
    return res.data;
};

export const deletePropertyApi = async (propertyId) => {
    const res = await api.delete(`/properties/${propertyId}`);
    return res.data;
};

export const getMyRentalsApi = async (params = {}) => {
    const res = await api.get("/rentals/me", { params });
    return res.data;
};

export const getRentalApi = async (rentalId) => {
    const res = await api.get(`/rentals/${rentalId}`);
    return res.data;
};

export const getOwnerRentalRequestsApi = async () => {
    const res = await api.get("/rental-requests/owner");
    return res.data;
};

export const markOwnerRentalRequestsViewedApi = async () => {
    const res = await api.patch("/rental-requests/owner/viewed");
    return res.data;
};

export const reviewOwnerRentalRequestApi = async (requestId, action) => {
    const res = await api.patch(`/rental-requests/${requestId}`, { action });
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

export const uploadRoomImagesApi = async (roomId, image) => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await api.post(`/rooms/${roomId}/images`, formData);
    return res.data;
};

export const getRoomApi = async (roomId) => {
    const res = await api.get(`/rooms/${roomId}`);
    return res.data;
};

export const updateRoomApi = async (roomId, roomData) => {
    const res = await api.patch(`/rooms/${roomId}`, roomData);
    return res.data;
};

export const deleteRoomImageApi = async (roomId, imageId) => {
    const res = await api.delete(`/rooms/${roomId}/images/${imageId}`);
    return res.data;
};

export const replaceRoomImageApi = async (roomId, image) => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await api.put(`/rooms/${roomId}/image`, formData);
    return res.data;
};

export const deleteRoomApi = async (roomId) => {
    const res = await api.delete(`/rooms/${roomId}`);
    return res.data;
};
