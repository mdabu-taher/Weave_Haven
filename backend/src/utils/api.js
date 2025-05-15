// src/utils/api.js
import axios from 'axios';
const api = axios.create({
  const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://weave-haven-backend.onrender.com/api',
  withCredentials: true
});

  withCredentials: true,
});
export default api;
