import api from "./api.js";

export const updateMyProfile = async (profileData) => {
  const response = await api.patch("/profiles/me", profileData);
  return response.data.profile;
};
