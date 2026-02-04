import { isAxiosError } from "axios";
import { privateApi } from "../interceptor";
import apiClient from "./authApi";

export const findUser = async (data: any) => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    console.log(error.status, "err");
    throw new Error(error.status);
  }
};

export const createUser = async (data: any) => {
  const response = await apiClient.post("/auth/signup", data);
  console.log(response.status);
  return response.data;
};

export const validateSession = async () => {
  try {
    await privateApi.get("/auth");
    return true;
  } catch {
    return false;
  }
};
