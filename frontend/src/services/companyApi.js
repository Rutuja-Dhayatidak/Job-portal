import API from "./axios";

export const sendCompanyOtp = async () => {
  const response = await API.post("/company/send-otp");
  return response.data;
};

export const verifyCompanyOtp = async (otp) => {
  const response = await API.post("/company/verify-otp", { otp });
  return response.data;
};

export const registerCompanyApi = async (companyData) => {
  const response = await API.post("/company/register", companyData);
  return response.data;
};

export const resubmitCompanyApi = async (companyData) => {
  const response = await API.put("/company/resubmit", companyData);
  return response.data;
};

export const loginCompanyApi = async (email, password) => {
  const response = await API.post("/company/login", { email, password });
  return response;
};

// --- EMPLOYER TEAM ROLE MANAGEMENT APIs ---

export const inviteTeamMemberApi = async (memberData) => {
  const response = await API.post("/employer/team/invite", memberData);
  return response.data;
};

export const getTeamApi = async () => {
  const response = await API.get("/employer/team");
  return response.data;
};

export const getInviteApi = async (token) => {
  const response = await API.get(`/employer/team/invite/${token}`);
  return response.data;
};

export const acceptInviteApi = async (token, password) => {
  const response = await API.post("/employer/team/accept-invite", { token, password });
  return response.data;
};

export const resendInviteApi = async (id) => {
  const response = await API.post(`/employer/team/resend-invite/${id}`);
  return response.data;
};

export const updateTeamMemberApi = async (id, role, status) => {
  const response = await API.put(`/employer/team/${id}`, { role, status });
  return response.data;
};

export const deleteTeamMemberApi = async (id) => {
  const response = await API.delete(`/employer/team/${id}`);
  return response.data;
};

// --- SUBSCRIPTION & PLANS APIs ---

export const getAllPlans = async () => {
  const response = await API.get('/plans');
  return response.data;
};

export const subscribeToPlan = async (planId) => {
  const response = await API.post('/employer/subscribe', { planId });
  return response.data;
};

export const createPaymentOrder = async (planId) => {
  const response = await API.post('/payments/create-order', { planId });
  return response.data;
};

export const verifyPaymentSignature = async (paymentDetails) => {
  const response = await API.post('/payments/verify-payment', paymentDetails);
  return response.data;
};

