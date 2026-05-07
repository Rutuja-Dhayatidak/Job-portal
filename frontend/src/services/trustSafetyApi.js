import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trustAdminToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboard = () => api.get('/trust/dashboard').then(res => res.data);
export const getReports = () => api.get('/trust/reports').then(res => res.data);
export const getModerationQueue = () => api.get('/trust/moderation').then(res => res.data);
export const approveContent = (modId) => api.post('/trust/approve', { modId }).then(res => res.data);
export const rejectContent = (modId, reason) => api.post('/trust/reject', { modId, reason }).then(res => res.data);
export const escalateReport = (modId) => api.post('/trust/escalate', { modId }).then(res => res.data);

export const getFraudData = () => api.get('/trust/fraud').then(res => res.data);

export const takeAction = (actionData) => api.post('/trust/action', actionData).then(res => res.data);
export const getActionHistory = () => api.get('/trust/action/history').then(res => res.data);

export const getBlocked = () => api.get('/trust/blocked').then(res => res.data);
export const unblockUser = (id) => api.post(`/trust/unblock/${id}`).then(res => res.data);
export const getLogs = () => api.get('/trust/logs').then(res => res.data);
export const searchData = (query) => api.get(`/trust/search?q=${query}`).then(res => res.data);

export const getKYC = () => api.get('/trust/kyc').then(res => res.data);
export const approveKYC = (id) => api.post(`/trust/kyc/approve/${id}`).then(res => res.data);
export const rejectKYC = (id, reason) => api.post(`/trust/kyc/reject/${id}`, { reason }).then(res => res.data);

// Company Verification
export const getCompanyRequests = (params) => api.get('/trust/company-requests', { params }).then(res => res.data);
export const approveCompany = (id) => api.post(`/trust/company-requests/${id}/approve`).then(res => res.data);
export const rejectCompany = (id, reason) => api.post(`/trust/company-requests/${id}/reject`, { reason }).then(res => res.data);
export const flagCompany = (id, riskScore, reason) => api.post(`/trust/company-requests/${id}/flag`, { riskScore, reason }).then(res => res.data);
export const verifyChecklist = (id, key, value) => api.post(`/trust/company-requests/${id}/verify-checklist`, { key, value }).then(res => res.data);
export const verifyCompanyDoc = (id, documentId, status) => api.post(`/trust/company-requests/${id}/verify-document`, { documentId, status }).then(res => res.data);
export const updateVerificationField = (companyId, field, value) => api.post('/trust/update-verification', { companyId, field, value }).then(res => res.data);

// Official email link verification flow
export const sendCompanyEmailLink = (company_id) => api.post('/trust/company/send-verification-link', { company_id }).then(res => res.data);
export const verifyCompanyEmailLink = (token) => api.post('/trust/company/verify-email-link', { token }).then(res => res.data);

export default api;
