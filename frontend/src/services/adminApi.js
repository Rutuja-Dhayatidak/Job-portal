import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

// Interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboard = async () => {
  const response = await API.get('/dashboard');
  return response.data;
};

export const getUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

export const addCandidate = async (data) => {
  const response = await API.post('/users/add', data);
  return response.data;
};

export const blockUser = async (id, reason) => {
  const response = await API.put(`/users/${id}/block`, { reason });
  return response.data;
};

export const getCandidateHistory = async (id) => {
  const response = await API.get(`/users/${id}/history`);
  return response.data;
};

export const getCompanies = async () => {
  const response = await API.get('/companies');
  return response.data;
};

export const verifyCompany = async (id) => {
  const response = await API.put(`/companies/${id}/verify`);
  return response.data;
};

export const approveCompany = async (id) => {
  const response = await API.put(`/companies/${id}/approve`);
  return response.data;
};

export const rejectCompany = async (id, reason) => {
  const response = await API.put(`/companies/${id}/reject`, { reason });
  return response.data;
};

export const getCompanyReviewDetails = async (id) => {
  const response = await API.get(`/companies/${id}/review`);
  return response.data;
};

export const escalateCompany = async (id, reason) => {
  const response = await API.put(`/companies/${id}/escalate`, { reason });
  return response.data;
};

export const getJobs = async () => {
  const response = await API.get('/jobs');
  return response.data;
};

export const approveJob = async (id) => {
  const response = await API.put(`/jobs/${id}/approve`);
  return response.data;
};

export const getTickets = async () => {
  const response = await API.get('/tickets');
  return response.data;
};

export const resolveTicket = async (id) => {
  const response = await API.put(`/tickets/${id}/resolve`);
  return response.data;
};

export default API;
