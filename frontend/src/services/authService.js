import axios from "axios";
import { getToken } from "../utils/tokenStorage";

const API = "https://auth-system-backend-y59n.onrender.com/api/auth";

export const login = async (userData) => {
  const response = await axios.post(`${API}/login`, userData);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await axios.post(`${API}/verify-otp`, data);
  return response.data;
};

export const resendOtp = async (email) => {
  const response = await axios.post(`${API}/resend-otp`, { email });
  return response.data;
};

export const getProfile = async () => {
  const token = getToken();

  const response = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API}/forgot-password`, { email });
  return response.data;
};

// --- Admin ---

export const getAllUsers = async () => {
  const token = getToken();

  const response = await axios.get(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const toggleUserActive = async (id) => {
  const token = getToken();

  const response = await axios.patch(
    `${API}/admin/users/${id}/toggle-active`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};
