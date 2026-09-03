import api from "./api.js";

export const submitOwnerApplication = async (documents) => {
  const formData = new FormData();

  documents.forEach((document) => {
    formData.append("documents", document);
  });

  const response = await api.post("/owner-applications", formData);
  return response.data;
};
