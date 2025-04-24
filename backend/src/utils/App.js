import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }                 from './context/AuthContext';
import ProtectedRoute                   from './components/ProtectedRoute';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Signup          from './pages/Signup';
import Cart            from './pages/Cart';
import OrderHistory    from './pages/OrderHistory';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard  from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/"     element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* user routes */}
          <Route element={<ProtectedRoute roles={['user','seller','admin']} />}>
            <Route path="/cart"    element={<Cart />} />
            <Route path="/orders"  element={<OrderHistory />} />
          </Route>

          {/* seller routes */}
          <Route element={<ProtectedRoute roles={['seller']} />}>
            <Route path="/seller"  element={<SellerDashboard />} />
          </Route>

          {/* admin routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin"   element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
