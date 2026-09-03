import api from "./api.js";

const extractAuthentication = (response, action) => {
  const token =
    response.data?.token ||
    response.data?.accessToken ||
    response.data?.data?.token ||
    response.data?.data?.accessToken;

  const user =
    response.data?.user ||
    response.data?.data?.user ||
    response.data?.data?.userData;

  if (!token || !user) {
    throw new Error(
      `${action} succeeded, but authentication data was incomplete`
    );
  }

  return { token, user };
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return extractAuthentication(response, "Login");
};

export const register = async (registrationData) => {
  const response = await api.post("/auth/register", registrationData);
  return response.data;
};
