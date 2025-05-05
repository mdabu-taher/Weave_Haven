// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',       // CRA proxy → Express backend
  withCredentials: true, // send/receive httpOnly auth cookie
});

// Attach token to all requests if it exists in localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** ───────────── AUTH HELPERS ───────────── **/

// Fetch the current user's profile (protected route)
export async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const { data } = await api.get('/auth/profile');
  return data;    // expects { id, fullName, username, email, phone, role, ... }
}

// Login and return the user object (including role)
export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', {
    identifier: email,
    password
  });
  // backend sets httpOnly cookie, but if it returns token you may store it:
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;  // data = user object from backend, must include .role
}

// Register a new user
export async function register(details) {
  const { data } = await api.post('/auth/register', details);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;  // adjust if backend wraps user differently
}

// Logout current user
export async function logout() {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
}

/** ─────────── PUBLIC PRODUCT HELPERS ─────────── **/

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

/** ─────────── ORDER HELPERS ─────────── **/

export async function fetchOrders() {
  const { data } = await api.get('/orders');
  return data;
}

/** ─────────── ADMIN CRUD HELPERS ─────────── **/

export async function fetchAdminProducts() {
  const { data } = await api.get('/admin/products');
  return data;
}

export async function createAdminProduct(payload) {
  const { data } = await api.post('/admin/products', payload);
  return data;
}

export async function updateAdminProduct(id, payload) {
  const { data } = await api.put(`/admin/products/${id}`, payload);
  return data;
}

export async function deleteAdminProduct(id) {
  await api.delete(`/admin/products/${id}`);
}

/** ─────────── ADMIN STATS HELPERS ─────────── **/

export async function fetchAdminOrders() {
  const { data } = await api.get('/admin/orders');
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await api.get('/admin/users');
  return data;
}

/** ─────────── EXPORT AXIOS INSTANCE ─────────── **/

export default api;
