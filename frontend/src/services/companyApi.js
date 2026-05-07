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
