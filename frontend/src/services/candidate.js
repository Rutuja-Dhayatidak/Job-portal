import API from "./axios";

// Register
export const registerCandidate = (data) =>
  API.post("/candidates/register", data);

// OTP verify
export const verifyOtp = (data) =>
  API.post("/candidates/verify-otp", data);

// Login
export const loginCandidate = (data) =>
  API.post("/candidates/login", data);

// Profile
export const getProfile = () =>
  API.get("/candidates/profile");