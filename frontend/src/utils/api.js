// src/utils/api.js

import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + '/api', // Make sure ends with `/api`
  withCredentials: true,                                // ⬅️ Enables cookie-based auth
});

/** ───────────── AUTH HELPERS ───────────── **/

export async function fetchProfile() {
  // Your back-end defines GET /api/auth/profile
  const { data } = await api.get('/auth/profile');
  return data;
}

export async function login({ identifier, password }) {
  // Your back-end login handler reads `req.body.email`, not `req.body.identifier`
  const { data } = await api.post('/auth/login', {
    email: identifier,
    password,
  });
  return data;
}

export async function register(details) {
  const { data } = await api.post('/auth/register', details);
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
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

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data;
}

/** ─────────── ADMIN HELPERS ─────────── **/

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

export async function fetchAdminOrders() {
  const { data } = await api.get('/admin/orders');
  return data;
}

export async function updateAdminOrderStatus(id, status) {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data;
}

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

export async function fetchAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function fetchAdminSalesData() {
  const { data } = await api.get('/admin/stats');
  return data.salesData;
}

export async function fetchTopProducts() {
  const { data } = await api.get('/admin/reports/top-products');
  return data;
}

/** ─────────── FEEDBACK HELPERS ─────────── **/

export async function createFeedback({ orderId, productId, rating, comment }) {
  const { data } = await api.post('/feedback', {
    orderId,
    productId,
    rating,
    comment,
  });
  return data;
}

export async function fetchProductFeedback(productId) {
  const { data } = await api.get(`/feedback/product/${productId}`);
  return data;
}

/** ─────────── PASSWORD HELPERS ─────────── **/

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

export async function verifyResetToken(token) {
  // GET /api/auth/reset-password/:token
  const { data } = await api.get(`/auth/reset-password/${token}`);
  return data;
}

export async function resetPassword(token, password) {
  // POST /api/auth/reset-password/:token
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
}

/** ─────────── EXPORT AXIOS INSTANCE ─────────── **/
export default api;
