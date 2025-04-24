// src/components/Header.js
import React from 'react';
import '../styles/Header.css'; // we'll write this next

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-logo">
        <img src="/Picture1.png" alt="Weave Haven logo" />
        <span>Weave Haven</span>
      </div>
      <div className="header-search">
        <input placeholder="Search for products…" />
        <button>Search</button>
      </div>
      <nav className="header-nav">
        <a href="/">Home</a>
        <a href="/cart">Cart</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
}
