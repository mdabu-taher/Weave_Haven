// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // thanks to CRA proxy to your Express app
  withCredentials: true,
});

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
