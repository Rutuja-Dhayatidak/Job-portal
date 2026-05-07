import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('financeAdminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Finance Admin APIs
export const getDashboard = async () => {
  const res = await api.get('/finance/dashboard');
  return res.data;
};

export const getRevenue = async (params) => {
  const res = await api.get('/finance/revenue', { params });
  return res.data;
};

export const getPlans = async () => {
  const res = await api.get('/finance/plans');
  return res.data;
};

export const createPlan = async (planData) => {
  const res = await api.post('/finance/plans', planData);
  return res.data;
};

export const updatePlan = async (id, planData) => {
  const res = await api.put(`/finance/plans/${id}`, planData);
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await api.delete(`/finance/plans/${id}`);
  return res.data;
};

export const getPayments = async (params) => {
  const res = await api.get('/finance/payments', { params });
  return res.data;
};

export const getPricing = async () => {
  const res = await api.get('/finance/pricing');
  return res.data;
};

export const updatePricing = async (pricingData) => {
  const res = await api.post('/finance/pricing', pricingData);
  return res.data;
};

export const getRefunds = async () => {
  const res = await api.get('/finance/refunds');
  return res.data;
};

export const approveRefund = async (id) => {
  const res = await api.post('/finance/refund/approve', { id });
  return res.data;
};

export const rejectRefund = async (id, reason) => {
  const res = await api.post('/finance/refund/reject', { id, reason });
  return res.data;
};

export default api;
