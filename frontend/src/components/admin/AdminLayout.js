import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/LOGO.png';
import '../../styles/AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* ───────── Full‑width Header ───────── */}
      <header className="admin-header">
        <div className="header-left">
          <img src={logo} alt="Weave Haven" className="admin-logo" />
          <div className="admin-title-group">
            <h1 className="admin-site-name">Weave Haven</h1>
            <p className="admin-subtitle">Manage your store effortlessly</p>
          </div>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      {/* ───────── Sidebar + Content Row ───────── */}
      <div className="admin-body">
        <aside className="admin-sidebar">
          <h2 className="sidebar-title">Admin</h2>
          <nav className="admin-nav">
            <NavLink to=""      end       className="admin-link">Dashboard</NavLink>
            <NavLink to="users"            className="admin-link">Users</NavLink>
            <NavLink to="products"         className="admin-link">Products</NavLink>
            <NavLink to="orders"           className="admin-link">Orders</NavLink>
            <NavLink to="analytics"        className="admin-link">Analytics</NavLink>
            <NavLink to="settings"         className="admin-link">Settings</NavLink>
          </nav>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
