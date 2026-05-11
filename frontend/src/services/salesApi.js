import API from "./axios";

// 📊 Dashboard analytics
export const getSalesDashboard = async () => {
  const res = await API.get("/sales/dashboard");
  return res.data;
};

// 👥 Leads CRM endpoints
export const getSalesLeads = async () => {
  const res = await API.get("/sales/leads");
  return res.data;
};

export const createLead = async (data) => {
  const res = await API.post("/sales/leads", data);
  return res.data;
};

export const updateLead = async (id, data) => {
  const res = await API.put(`/sales/leads/${id}`, data);
  return res.data;
};

export const deleteLead = async (id) => {
  const res = await API.delete(`/sales/leads/${id}`);
  return res.data;
};

// 📆 Tasks endpoints
export const getSalesTasks = async () => {
  const res = await API.get("/sales/tasks");
  return res.data;
};

export const createSalesTask = async (data) => {
  const res = await API.post("/sales/tasks", data);
  return res.data;
};

export const updateSalesTask = async (id, data) => {
  const res = await API.put(`/sales/tasks/${id}`, data);
  return res.data;
};

// 🗓️ Follow-ups endpoint
export const getFollowUpsList = async () => {
  const res = await API.get("/sales/followups");
  return res.data;
};

// 👤 Profile settings endpoints
export const getSalesProfile = async () => {
  const res = await API.get("/sales/profile");
  return res.data;
};

export const updateSalesProfile = async (data) => {
  const res = await API.put("/sales/profile", data);
  return res.data;
};
