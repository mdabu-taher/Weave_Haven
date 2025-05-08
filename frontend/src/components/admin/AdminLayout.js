// src/components/admin/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../styles/AdminLayout.css';  // adjust path if your CSS lives in src/styles

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin</h2>
        <nav className="admin-nav">
          <NavLink to=""      end className="admin-link">Dashboard</NavLink>
          <NavLink to="users"       className="admin-link">Users</NavLink>
          <NavLink to="products"    className="admin-link">Products</NavLink>
          <NavLink to="orders"      className="admin-link">Orders</NavLink>
          <NavLink to="analytics"   className="admin-link">Analytics</NavLink>
          <NavLink to="settings"    className="admin-link">Settings</NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
