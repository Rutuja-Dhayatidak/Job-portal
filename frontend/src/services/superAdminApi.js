import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const superAdminAPI = axios.create({
  baseURL: `${BASE_URL}/super-admin`,
});

// Add Interceptor to add token
superAdminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const verifyInvite = async (token) => {
  const response = await axios.get(`${BASE_URL}/auth/verify-invite/${token}`);
  return response; // ActivateAdmin.jsx expects the full response object to access .data
};

export const activateAdmin = async (data) => {
  const response = await axios.post(`${BASE_URL}/auth/activate-admin`, data);
  return response;
};

export const getDashboard = async () => {
  const response = await superAdminAPI.get('/dashboard');
  return response.data;
};

export const getCandidates = async () => {
  const response = await superAdminAPI.get('/candidates');
  return response.data;
};

export const blockCandidate = async (id, reason) => {
  const response = await superAdminAPI.put(`/candidates/${id}/block`, { reason });
  return response.data;
};

export const overrideCandidate = async (id, action, reason) => {
  const response = await superAdminAPI.patch(`/candidates/${id}/override`, { action, reason });
  return response.data;
};

export const getCandidateHistory = async (id) => {
  const response = await superAdminAPI.get(`/candidates/${id}/history`);
  return response.data;
};

export const createAdminInvite = async (data) => {
  const response = await superAdminAPI.post('/admins/create', data);
  return response.data;
};

export const getAdmins = async () => {
  const response = await superAdminAPI.get('/admins');
  return response.data;
};

export const updateAdmin = async (id, data) => {
  const response = await superAdminAPI.put(`/admins/${id}`, data);
  return response.data;
};

export const suspendAdmin = async (id) => {
  const response = await superAdminAPI.put(`/admins/${id}/suspend`);
  return response.data;
};

export const revokeAdmin = async (id) => {
  const response = await superAdminAPI.delete(`/admins/${id}`);
  return response.data;
};

export const getCompanies = async () => {
  const response = await superAdminAPI.get('/companies');
  return response.data;
};

export const verifyCompany = async (id) => {
  const response = await superAdminAPI.put(`/companies/${id}/verify`);
  return response.data;
};

export const getJobs = async () => {
  const response = await superAdminAPI.get('/jobs');
  return response.data;
};

export const updateJobStatus = async (id, status) => {
  const response = await superAdminAPI.put(`/jobs/${id}/status`, { status });
  return response.data;
};

// RBAC Endpoints
export const seedRoles = async () => {
  const response = await superAdminAPI.post('/rbac/seed');
  return response.data;
};

export const getRoles = async () => {
  const response = await superAdminAPI.get('/rbac/roles');
  return response.data;
};

export const getRolePermissions = async (roleName) => {
  const response = await superAdminAPI.get(`/rbac/permissions/${roleName}`);
  return response.data;
};

export const updateRolePermissions = async (roleName, permissions) => {
  const response = await superAdminAPI.post('/rbac/update', { roleName, permissions });
  return response.data;
};

export default superAdminAPI;
// Audit Logs
export const getAuditLogs = async (params) => {
  const response = await superAdminAPI.get('/audit', { params });
  return response.data;
};

export const getAuditLogById = async (id) => {
  const response = await superAdminAPI.get(`/audit/${id}`);
  return response.data;
};

// Plans Management Endpoints
export const getPlans = async () => {
  const response = await superAdminAPI.get('/plans');
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await superAdminAPI.post('/plans', planData);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await superAdminAPI.put(`/plans/${id}`, planData);
  return response.data;
};

export const togglePlanActive = async (id, isActive) => {
  const response = await superAdminAPI.patch(`/plans/${id}/toggle`, { is_active: isActive });
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await superAdminAPI.delete(`/plans/${id}`);
  return response.data;
};

export const getPlanStats = async () => {
  const response = await superAdminAPI.get('/plans/stats');
  return response.data;
};
