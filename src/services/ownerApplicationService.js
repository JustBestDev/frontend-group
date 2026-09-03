import api from "./api.js";

const createDocumentsFormData = (documents) => {
  const formData = new FormData();
  documents.forEach((document) => {
    formData.append("documents", document);
  });
  return formData;
};

export const submitOwnerApplication = async (documents) => {
  const response = await api.post("/owner-applications", createDocumentsFormData(documents));
  return response.data;
};

export const resubmitOwnerApplication = async (documents) => {
  const response = await api.patch("/owner-applications/me", createDocumentsFormData(documents));
  return response.data.data;
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
