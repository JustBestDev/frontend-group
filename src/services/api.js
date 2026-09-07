import axios from "axios";
import useAuthStore from "../stores/authStore.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getApiErrorMessage = (error, fallback) => {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (message && typeof message === "object") {
        const details = Object.values(message).flat().filter(Boolean).join(" ");
        if (details) return details;
    }
    return error.message || fallback;
};

export default api;
