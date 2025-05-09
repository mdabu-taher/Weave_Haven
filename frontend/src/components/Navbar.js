import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const hideSearch = /^\/(account|orders|membership|bonus|settings)/.test(pathname);

  const searchBoxRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // Track window width
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close desktop search when clicking outside
  useEffect(() => {
    const onClick = e => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live‑search debounce
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
        console.error(err);
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
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT */}
        <div className="navbar-left">
          {!isAdmin && (
            <div className="hamburger" onClick={() => setSidebarOpen(true)}>
              <div className="bar"/><div className="bar"/><div className="bar"/>
            </div>
          )}
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Weave Haven" className="brand-logo" />
            <span className="brand-text">Weave Haven</span>
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
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setDesktopSearchOpen(o => !o)}
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
                    <button onClick={doSearch} className="search-btn">
                      <FaSearch />
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

          {/* Account / Login */}
          <div className="account-wrapper">
            {user ? (
              <div ref={userMenuRef} className="user-menu-container">
                <div
                  className="auth-icon-wrapper"
                  onClick={() => setUserMenuOpen(o => !o)}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setUserMenuOpen(o => !o)}
                >
                  <FaUser className="nav-icon" />
                </div>

                {userMenuOpen && (
                  <ul className="dropdown-menu user-menu">
                    <li><Link to="/account">My account</Link></li>
                    <li><Link to="/orders">Order history</Link></li>
                    <li><Link to="/membership">My membership</Link></li>
                    <li><Link to="/bonus">Bonus overview</Link></li>
                    <li><Link to="/settings">My settings</Link></li>
                    <li>
                      <button className="logout-btn" onClick={handleLogout}>
                        Log out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="auth-icon-wrapper" onClick={openLogin}>
                <FaUser className="nav-icon auth-icon" />
              </div>
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

      {/* Mobile Search Bar */}
      {!isAdmin && windowWidth <= 768 && !hideSearch && (
        <div className="mobile-search-bar">
          <FaSearch
            className="search-icon-left"
            onClick={doSearch}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
          />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Search for jacket, shirt, jeans..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
          />
          {searchTerm.trim() && (
            suggestions.length > 0 ? (
              <ul className="mobile-suggestions">
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
              <div className="mobile-no-suggestions">No matches</div>
            )
          )}
        </div>
      )}

      {/* Sidebar Drawer & Modals */}
      {modal === 'login' && <LoginModal onClose={() => setModal('none')} onSwitch={() => setModal('register')} />}
      {modal === 'register' && <RegisterModal onClose={() => setModal('none')} onSwitch={() => setModal('login')} />}
      {/* …other sidebar/modal code… */}
    </>
  );
}
