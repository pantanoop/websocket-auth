import apiClient from "./authApi";

export const findUser = async (data: any) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const createUser = async (data: any) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

export const validateSession = async () => {
  try {
    await apiClient.get("/auth");
    return true;
  } catch {
    return false;
  }
};
