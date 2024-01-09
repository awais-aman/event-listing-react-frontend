import axios from "axios";
import { getToken } from "./session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/",
});

// The Rails API hands out the JWT already prefixed with "Bearer ", so it is
// sent back exactly as stored; adding a prefix here would double it.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = token;
  return config;
});

let handleUnauthorized = null;

export const onUnauthorized = (handler) => {
  handleUnauthorized = handler;
  return () => {
    if (handleUnauthorized === handler) handleUnauthorized = null;
  };
};

// A 401 from /login means wrong credentials and from /logout an already dead
// session; anywhere else it means the stored token expired or was revoked.
api.interceptors.response.use(undefined, (error) => {
  const url = error.config?.url ?? "";
  const isSessionCall = /\/(login|logout)$/.test(url);
  if (error.response?.status === 401 && !isSessionCall) {
    error.sessionExpired = true;
    handleUnauthorized?.();
  }
  return Promise.reject(error);
});

export default api;
