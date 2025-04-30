// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // thanks to CRA proxy to your Express app
  withCredentials: true,
});

// Attach token to all requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth helpers
export async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    // no token, skip the API call
    return null;
  }
  const { data } = await api.get('/auth/profile');
  return data;
}

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  // assumes server sets a cookie or returns a token
  if (data.token) localStorage.setItem('token', data.token);
  return data.user;
}

export async function register(details) {
  const { data } = await api.post('/auth/register', details);
  if (data.token) localStorage.setItem('token', data.token);
  return data.user;
}

export async function logout() {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
}

// Product endpoints
export async function getProducts(filters) {
  const { data } = await api.get('/products', { params: filters });
  return data;
}

export async function getCategories() {
  const { data } = await api.get('/products/categories');
  return data;
}

export async function getSizes() {
  const { data } = await api.get('/products/sizes');
  return data;
}

export async function getColors() {
  const { data } = await api.get('/products/colors');
  return data;
}

export default api;
