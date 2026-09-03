import api from "./api.js";

export const getMyProfile = async () => {
  const response = await api.get("/profiles/me");
  return response.data.profile;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.patch("/profiles/me", profileData);
  return response.data.profile;
};
