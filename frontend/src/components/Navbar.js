// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import logo from '../assets/LOGO.png';
import categories from '../utils/categories';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, login, logout } = useAuth();

  const [modal, setModal] = useState('none');           // 'none' | 'login' | 'register'
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin    = pathname.startsWith('/admin');
  const hideSearch = /^\/(account|orders|membership|bonus|settings)/.test(pathname);
  const searchBoxRef = useRef(null);

  // Build API_ROOT for images (strip any trailing /api)
  const API_ROOT = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/api\/?$/, '');

  // Track window width for responsive behavior
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Close desktop search on outside click
  useEffect(() => {
    const onClick = e => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  // Debounced live-search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
        setSuggestions(res.data.slice(0, 5));
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  const doSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
    setSuggestions([]);
    setDesktopSearchOpen(false);
  };
  const handleSelectSuggestion = id => {
    navigate(`/product/${id}`);
    setSearchTerm('');
    setSuggestions([]);
    setDesktopSearchOpen(false);
  };
  const openLogin = () => setModal('login');
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <>
      <nav className="navbar">
        {/* LEFT */}
        <div className="navbar-left">
          {!isAdmin && (
            <div className="hamburger" onClick={() => setSidebarOpen(true)}>
              <div className="bar" /><div className="bar" /><div className="bar" />
            </div>
          )}
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Weave Haven" className="brand-logo" />
            <span className="brand-text">Weave Haven</span>
          </Link>
        </div>
        {/* CENTER (main nav) */}
        <div className="navbar-center">
          <ul className="main-nav">
            {categories.map(cat => {
              const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <li className="nav-item" key={cat.name}>
                  <Link to={`/products/${slug}`}>{cat.name}</Link>
                  <ul className="dropdown-menu">
                    {cat.subcategories.map(sub => {
                      const subSlug = sub.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <li key={sub}>
                          <Link to={`/products/${slug}/${subSlug}`}>{sub}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
        {/* RIGHT */}
        <div className="navbar-right">
          {/* Desktop Search */}
          {windowWidth > 768 && !isAdmin && !hideSearch && (
            <div className="desktop-search-wrapper" ref={searchBoxRef}>
              <FaSearch
                className="nav-icon desktop-search-icon"
                onClick={() => setDesktopSearchOpen(o => !o)}
              />
              {desktopSearchOpen && (
                <div className="desktop-search-box">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search for jacket, shirt, jeans..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && doSearch()}
                      autoFocus
                    />
                    <button onClick={doSearch} className="search-btn">🔍</button>
                  </div>
                  {suggestions.length > 0 ? (
                    <ul className="live-suggestions">
                      {suggestions.map(p => {
                        const thumb = p.photos?.[0] || null;
                        const src = thumb
                          ? (thumb.startsWith('http') ? thumb : `${API_ROOT}${thumb}`)
                          : '/placeholder.png';
                        return (
                          <li
                            key={p._id}
                            onClick={() => handleSelectSuggestion(p._id)}
                          >
                            <img
                              src={src}
                              alt={p.name}
                              className="suggestion-thumb"
                              onError={e => e.currentTarget.src = '/placeholder.png'}
                            />
                            <span>{p.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    searchTerm.trim() && <div className="no-suggestions">No matches</div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Account / Login */}
          <div className="account-wrapper">
            {user ? (
              <div className="user-dropdown">
                <FaUser className="nav-icon" />
                <div className="dropdown-menu">
                  <Link to="/account">My account</Link>
                  <Link to="/orders">Order history</Link>
                  <Link to="/membership">My membership</Link>
                  <Link to="/bonus">Bonus overview</Link>
                  <Link to="/settings">My settings</Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <FaUser className="nav-icon auth-icon" onClick={openLogin} />
            )}
          </div>
          {/* Wishlist */}
          <Link to="/favorites" className="wishlist-icon-wrapper">
            <FaHeart className="nav-icon heart-icon" />
            {wishlistItems.length > 0 && (
              <span className="wishlist-count">{wishlistItems.length}</span>
            )}
          </Link>
          {/* Cart */}
          <Link to="/cart" className="cart-icon-wrapper">
            <FaShoppingBag className="nav-icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </nav>
      {/* Mobile Search Bar + suggestions */}
      {!isAdmin && windowWidth <= 768 && !hideSearch && (
        <div className="mobile-search-bar">
          <FaSearch className="search-icon-left" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Search for jacket, shirt, jeans..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
          />
          {suggestions.length > 0 && (
            <ul className="live-suggestions">
              {suggestions.map(p => {
                const thumb = p.photos?.[0] || null;
                const src = thumb
                  ? (thumb.startsWith('http') ? thumb : `${API_ROOT}${thumb}`)
                  : '/placeholder.png';
                return (
                  <li
                    key={p._id}
                    onClick={() => handleSelectSuggestion(p._id)}
                  >
                    <img
                      src={src}
                      alt={p.name}
                      className="suggestion-thumb"
                      onError={e => e.currentTarget.src = '/placeholder.png'}
                    />
                    <span>{p.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {/* Sidebar for mobile categories */}
      {!isAdmin && (
        <>
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={() => setSidebarOpen(false)}>
              ×
            </button>
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products/${cat.name.toLowerCase()}`}
                onClick={() => setSidebarOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </>
      )}
      {/* Auth Modals */}
      {!user && modal === 'login' && (
        <LoginModal
          onClose={() => setModal('none')}
          onSwitch={() => setModal('register')}
        />
      )}
      {!user && modal === 'register' && (
        <RegisterModal
          onClose={() => setModal('none')}
          onSwitch={() => setModal('login')}
        />
      )}
    </>
  );
}
