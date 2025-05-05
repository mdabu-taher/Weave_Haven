// frontend/src/components/admin/RequireAdmin.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function RequireAdmin() {
  const { user, loading } = useContext(AuthContext);

  // While auth status is being determined, render a simple loading state
  if (loading) {
    return <p>Loading authentication…</p>;
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, show forbidden message
  if (user.role !== 'admin') {
    return <p>Forbidden: Admins only</p>;
  }

  // Authorized: render nested admin routes
  return <Outlet />;
}
