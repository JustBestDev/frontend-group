import { create } from "zustand";
import { getMyProfileApi } from "../services/ownerApi";

const useOwnerStore = create((set, get) => ({
    ownerData: [],
    currentOwner: null,
    getMyProfile: async () => {
        const res = await getMyProfileApi()
        set({ ownerData: res.data.posts })
        return res.data
    }
}))