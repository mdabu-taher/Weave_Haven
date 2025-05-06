// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import logo from "../assets/LOGO.png";
import categories from '../utils/categories';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const { cartItems, wishlistItems } = useCart();
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // Handle window resize
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close desktop search when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/api/products/search?q=${encodeURIComponent(searchTerm)}`
        );
        setSuggestions(res.data.slice(0, 5));
      } catch (err) {
        console.error('Live search failed:', err);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Search submission
  const doSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
    setSuggestions([]);
    setDesktopSearchOpen(false);
  };

  // Navigate to selected suggestion
  const handleSelectSuggestion = (id) => {
    navigate(`/product/${id}`);
    setSearchTerm('');
    setSuggestions([]);
    setDesktopSearchOpen(false);
  };

  const openLogin = () => setModal('login');

  // Log out
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT */}
        <div className="navbar-left">
          <div className="hamburger" onClick={() => setSidebarOpen(true)}>
            <div className="bar" /><div className="bar" /><div className="bar" />
          </div>
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Weave Haven" className="brand-logo" />
          </Link>
        </div>

        {/* CENTER */}
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
                          <Link to={`/products/${slug}/${subSlug}`}>
                            {sub}
                          </Link>
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
          {windowWidth > 768 && (
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
                    <button
                      type="button"
                      className="search-btn"
                      onClick={doSearch}
                      aria-label="Search"
                    >
                      🔍
                    </button>
                  </div>
                  {suggestions.length > 0 ? (
                    <ul className="live-suggestions">
                      {suggestions.map(p => (
                        <li key={p._id} onClick={() => handleSelectSuggestion(p._id)}>
                          <img
                            src={p.photos?.[0] || '/placeholder.png'}
                            alt={p.name}
                            className="suggestion-thumb"
                          />
                          <span>{p.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    searchTerm.trim() && <div className="no-suggestions">No matches</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Account */}
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

      {/* Mobile Search */}
      {windowWidth <= 768 && (
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
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <Link to="/products/men" onClick={() => setSidebarOpen(false)}>Men</Link>
        <Link to="/products/women" onClick={() => setSidebarOpen(false)}>Women</Link>
        <Link to="/products/kids" onClick={() => setSidebarOpen(false)}>Kids</Link>
        <Link to="/products/newborn" onClick={() => setSidebarOpen(false)}>Newborn</Link>
        <Link to="/products/new-arrivals" onClick={() => setSidebarOpen(false)}>
          New Arrivals
        </Link>
        <Link to="/products/sale" onClick={() => setSidebarOpen(false)}>Sale</Link>
      </div>

      {/* Modals */}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal('none')}
          onSwitch={() => setModal('register')}
          onSuccess={ud => { setUser(ud); setModal('none'); }}
        />
      )}
      {modal === 'register' && (
        <RegisterModal
          onClose={() => setModal('none')}
          onSwitch={() => setModal('login')}
        />
      )}
    </>
  );
}
