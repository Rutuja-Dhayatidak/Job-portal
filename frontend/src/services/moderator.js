import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${API_URL}/moderator`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moderatorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/login', credentials).then(res => res.data);
export const getStats = () => api.get('/stats').then(res => res.data);
export const getReports = () => api.get('/reports').then(res => res.data);
export const reviewReport = (id, data) => api.put(`/report/${id}/review`, data).then(res => res.data);
export const getUsers = () => api.get('/users').then(res => res.data);
export const banUser = (id) => api.put(`/ban/${id}`).then(res => res.data);
export const unbanUser = (id) => api.put(`/unban/${id}`).then(res => res.data);
export const warnUser = (id, reason) => api.put(`/warn/${id}`, { reason }).then(res => res.data);
export const getJobs = () => api.get('/jobs').then(res => res.data);
export const approveJob = (id) => api.put(`/job/${id}/approve`).then(res => res.data);
export const rejectJob = (id) => api.put(`/job/${id}/reject`).then(res => res.data);
export const getLogs = () => api.get('/logs').then(res => res.data);

export default api;
