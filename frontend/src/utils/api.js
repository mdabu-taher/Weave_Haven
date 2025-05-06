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

export async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const { data } = await api.get('/auth/profile');
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', {
    identifier: email,
    password
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function register(details) {
  const { data } = await api.post('/auth/register', details);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

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

/** ─────────── ADMIN HELPERS ─────────── **/

// Products CRUD
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

// Orders CRUD & Status
export async function fetchAdminOrders() {
  const { data } = await api.get('/admin/orders');
  return data;
}

export async function updateAdminOrderStatus(id, status) {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data;
}

// Users
export async function fetchAdminUsers() {
  const { data } = await api.get('/admin/users');
  return data;
}

export async function deleteAdminUser(id) {
  await api.delete(`/admin/users/${id}`);
}

export async function updateAdminUserRole(id, role) {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
}

// Full dashboard stats (counts + sales over time)
export async function fetchAdminStats() {
  const { data } = await api.get('/admin/stats');
  // returns: { productCount, orderCount, userCount, salesData: [{ date, total }] }
  return data;
}

// Standalone sales data (if you ever need only the sales array)
export async function fetchAdminSalesData() {
  const { data } = await api.get('/admin/stats');
  return data.salesData;
}

// Top 5 Selling Products report
export async function fetchTopProducts() {
  const { data } = await api.get('/admin/reports/top-products');
  // returns: [{ productId, name, totalSold, price }]
  return data;
}

/** ─────────── EXPORT AXIOS INSTANCE ─────────── **/

export default api;
