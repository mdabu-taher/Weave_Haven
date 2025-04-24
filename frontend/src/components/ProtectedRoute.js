import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/cart" element={<CartPage />} />
 * </Route>
 *
 * <Route element={<ProtectedRoute roles={['admin']} />}>
 *   <Route path="/admin" element={<AdminDashboard />} />
 * </Route>
 */
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p>Loading session…</p>;

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    // logged in but wrong role
    return <Navigate to="/" replace />;
  }
  // authorized
  return <Outlet />;
}
