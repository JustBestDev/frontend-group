import { create } from "zustand";
import {
    getMyProfileApi,
    getMyPropertiesApi,
    getMyRentalsApi,
    updateMyProfileApi,
} from "../services/ownerApi.js";

const useOwnerStore = create((set) => ({
    profile: null,
    profileLoading: false,
    profileError: null,
    properties: [],
    rentals: [],
    rentalPagination: null,
    isLoading: false,
    error: null,
    getMyProfile: async () => {
        set({ profileLoading: true, profileError: null });
        try {
            const { profile } = await getMyProfileApi();
            set({ profile, profileLoading: false });
            return profile;
        } catch (error) {
            set({ profileError: error.response?.data?.message || error.message, profileLoading: false });
            throw error;
        }
    },
    updateMyProfile: async (profileData) => {
        set({ profileLoading: true, profileError: null });
        try {
            const { profile } = await updateMyProfileApi(profileData);
            set({ profile, profileLoading: false });
            return profile;
        } catch (error) {
            set({ profileError: error.response?.data?.message || error.message, profileLoading: false });
            throw error;
        }
    },
    getMyProperties: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getMyPropertiesApi();
            set({ properties: response.data || [], isLoading: false });
            return response.data || [];
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            throw error;
        }
    },
    getMyRentals: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getMyRentalsApi(params);
            set({ rentals: response.data || [], rentalPagination: response.pagination, isLoading: false });
            return response.data || [];
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            throw error;
        }
    },
}));

export default useOwnerStore;
