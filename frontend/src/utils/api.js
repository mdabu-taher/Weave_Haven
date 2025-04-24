// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',         // thanks to your CRA proxy
  withCredentials: true,   // sends/accepts httpOnly cookie for auth
});

export default api;
