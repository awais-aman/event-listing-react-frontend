import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.url.includes("/login") || config.url.includes("/logout")) {
    localStorage.removeItem("token");
    return config;
  } else if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
