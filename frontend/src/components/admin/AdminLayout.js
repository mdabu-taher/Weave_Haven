// src/components/admin/AdminLayout.jsx

import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../../assets/LOGO.png';          // adjust path if needed
import '../../styles/AdminLayout.css';
import '../../styles/AdminNavbar.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-page">

      {/* Mobile header with hamburger + logo + title */}
      <header className="admin-header">
        <button
          className="admin-menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="admin-header-brand">
          <img src={logo} alt="Weave Haven" className="admin-header-logo" />
          <h2 className="admin-header-title">Weave Haven Admin Panel</h2>
        </div>
      </header>

      <div className="admin-container">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button
            className="admin-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>

          <h2 className="admin-logo">Admin</h2>
          <nav className="admin-nav">
            <NavLink to="" end className="admin-link">Dashboard</NavLink>
            <NavLink to="users"      className="admin-link">Users</NavLink>
            <NavLink to="products"   className="admin-link">Products</NavLink>
            <NavLink to="orders"     className="admin-link">Orders</NavLink>
            <NavLink to="analytics"  className="admin-link">Analytics</NavLink>
            <NavLink to="settings"   className="admin-link">Settings</NavLink>
          </nav>
        </aside>

        {/* Main content; clicking closes sidebar on mobile */}
        <main
          className="admin-main"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
