// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://weave-haven-backend.onrender.com/api',
  withCredentials: true,
});

export default api;
