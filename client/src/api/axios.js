import axios from 'axios';

// In dev, Vite proxies /api to the backend. In prod, set VITE_API_URL.
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

const baseURL = (import.meta.env.VITE_API_URL || '') + '/api';

console.log("Axios baseURL =", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach bearer token (kept in localStorage as a fallback to the httpOnly cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduboard_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error messages so callers can show err.message directly
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
