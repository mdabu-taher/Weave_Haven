// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';

import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected user/seller/admin routes */}
          <Route element={<ProtectedRoute roles={['user', 'seller', 'admin']} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Route>

          {/* Seller-only route */}
          <Route element={<ProtectedRoute roles={['seller']} />}>
            <Route path="/seller" element={<SellerDashboard />} />
          </Route>

          {/* Admin-only route */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
