import axios from 'axios';
import { Device, DeviceType, DeviceStats, Alert } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const deviceService = {
  getAll: async (params?: { status?: string; typeId?: string; page?: number; limit?: number }) => {
    const response = await api.get('/devices', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },

  create: async (deviceData: Partial<Device>) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  },

  update: async (id: string, deviceData: Partial<Device>) => {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/devices/stats/overview');
    return response.data;
  },
};

export const deviceTypeService = {
  getAll: async () => {
    const response = await api.get('/device-types');
    return response.data;
  },
};

export const alertService = {
  getAll: async (params?: { isResolved?: boolean; page?: number; limit?: number }) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },

  resolve: async (id: string) => {
    const response = await api.patch(`/alerts/${id}/resolve`);
    return response.data;
  },
};

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
