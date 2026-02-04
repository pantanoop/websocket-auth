import { store } from "../store";
import apiClient from "./services/authApi";
import { logout } from "../auth/authenticateSlice";

export const setupInterceptors = () => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());

        window.location.href = "/pages/auth/login";
      }

      return Promise.reject(error);
    },
  );
};
