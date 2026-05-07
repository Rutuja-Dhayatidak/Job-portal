import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('opsAdminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboard = () => api.get('/ops/dashboard').then(res => res.data);
export const getUsers = () => api.get('/ops/users').then(res => res.data);
export const getCompanies = () => api.get('/ops/companies').then(res => res.data);
export const approveCompany = (id) => api.post(`/ops/company/approve/${id}`).then(res => res.data);
export const rejectCompany = (id) => api.post(`/ops/company/reject/${id}`).then(res => res.data);
export const getJobs = () => api.get('/ops/jobs').then(res => res.data);
export const deleteJob = (id) => api.delete(`/ops/job/${id}`).then(res => res.data);
export const getModeration = () => api.get('/ops/moderation').then(res => res.data);
export const approveContent = (id) => api.post(`/ops/approve/${id}`).then(res => res.data);
export const rejectContent = (id) => api.post(`/ops/reject/${id}`).then(res => res.data);
export const getSupportTickets = () => api.get('/ops/support').then(res => res.data);
export const resolveTicket = (id) => api.post(`/ops/support/resolve/${id}`).then(res => res.data);
export const getLogs = () => api.get('/ops/logs').then(res => res.data);

export default api;
