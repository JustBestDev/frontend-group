import api from "./api.js";

export const submitOwnerApplication = async (documents) => {
  const formData = new FormData();

  documents.forEach((document) => {
    formData.append("documents", document);
  });

  const response = await api.post("/owner-applications", formData);
  return response.data;
};

export const getMyOwnerApplication = async () => {
  try {
    const response = await api.get("/owner-applications/me");
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};
