import { logout } from "../auth/authenticateSlice";
import axios from "axios";

export const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired,Logging out...");
      if (store) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  },
);
