import axios from "axios";

// Backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request Interceptor: har so'rovda token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: xatoliklarni boshqarish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 - Token muddati tugagan
    if (status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Types
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Login function (backward compatibility)
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/user/login", data);
  return response.data;
};
