import axios from 'axios';
import type { LoginCredentials, LoginResponse, SearchParams, Record, CreateRecordData } from '@/types';
import { trackError } from '@/utils/analytics';

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      console.warn('401 Unauthorized - Token expired or invalid');

      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        trackError('401 Unauthorized - Redirecting to login', `API/${url}`);
        window.location.href = '/login';
      }
    }

    // 403 Forbidden
    if (status === 403) {
      console.error('403 Forbidden - Access denied');
      trackError('403 Forbidden - Access denied', `API/${url}`);
    }

    // 404 Not Found
    if (status === 404) {
      console.error('404 Not Found - Resource not found');
      trackError('404 Not Found', `API/${url}`);
    }

    // 500 Server Error
    if (status === 500) {
      console.error('500 Server Error');
      trackError('500 Server Error', `API/${url}`);
    }

    // Network Error
    if (!error.response) {
      console.error('Network Error - No internet connection');
      trackError('Network Error - No internet', `API/${url}`);
    }

    return Promise.reject(error);
  }
);

// Auth APIs - Match backend endpoints
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>('/user/login', credentials);
      return data;
    } catch (error: any) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async (): Promise<{ user: any }> => {
    try {
      const { data } = await api.get('/user/me');
      return data;
    } catch (error: any) {
      console.error('GetMe API error:', error);
      throw error;
    }
  },
};

// Records APIs - Not used (fraudster endpoints used instead)
export const recordsAPI = {
  search: async (params: SearchParams): Promise<Record | null> => {
    try {
      const { data } = await api.get<Record | null>('/fraudster/search', { params });
      return data;
    } catch (error: any) {
      console.error('Search API error:', error);
      throw error;
    }
  },

  getMyRecords: async (): Promise<Record[]> => {
    try {
      const { data } = await api.get<Record[]>('/fraudster/my-count');
      return data;
    } catch (error: any) {
      console.error('GetMyRecords API error:', error);

      if (error.response?.status === 404) {
        return [];
      }

      throw error;
    }
  },

  create: async (recordData: CreateRecordData): Promise<Record> => {
    try {
      const { data } = await api.post<Record>('/fraudster', recordData);
      return data;
    } catch (error: any) {
      console.error('Create API error:', error);
      throw error;
    }
  },
};

// Login API (backward compatibility)
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return authAPI.login(credentials);
};

export { api };
export default api;
