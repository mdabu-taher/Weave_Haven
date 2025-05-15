// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://weave-haven-backend.onrender.com/api'.replace(/\/+$/, ''),
  withCredentials: true,
});

export default api;
