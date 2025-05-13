import React from 'react';
import logo from '../../assets/LOGO.png';  // or your actual logo path
import '../../styles/AdminNavbar.css';

export default function AdminNavbar() {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-content">
        <img
          src={logo}
          alt="Weave Haven"
          className="admin-navbar-logo"
        />
        <span className="admin-navbar-title">
          Weave Haven Admin Panel
        </span>
      </div>
    </header>
  );
}
