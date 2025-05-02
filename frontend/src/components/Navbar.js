import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import logo from "../assets/LOGO.png";
import categories from '../utils/categories';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setDesktopSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogin = () => setModal('login');

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm('');
      setDesktopSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT: Logo + Hamburger */}
        <div className="navbar-left">
          <div className="hamburger" onClick={() => setSidebarOpen(true)}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Weave Haven" className="brand-logo" />
          </Link>
        </div>

        {/* CENTER: Categories with dropdown */}
        <div className="navbar-center">
          <ul className="main-nav">
            {categories.map((cat, idx) => (
              <li className="nav-item" key={idx}>
                <Link to={`/products/${cat.name.toLowerCase()}`}>{cat.name}</Link>
                <ul className="dropdown-menu">
                  {cat.subcategories.map((sub, subIdx) => (
                    <li key={subIdx}>
                      <Link to={`/products/${cat.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}>
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Icons */}
        <div className="navbar-right">
          {windowWidth > 768 && (
            <div className="desktop-search-wrapper">
              <FaSearch
                className="nav-icon desktop-search-icon"
                onClick={() => setDesktopSearchOpen(prev => !prev)}
              />
              {desktopSearchOpen && (
                <div className="desktop-search-box" ref={searchBoxRef}>
                  <input
                    type="text"
                    placeholder="Search for jacket, shirt, jeans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                  />
                  <div className="suggestions">
                    <strong>Popular:</strong>
                    <ul>
                      <li>T-Shirts</li>
                      <li>Jeans</li>
                      <li>Shirts</li>
                      <li>Boxers</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

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
                  <button className="logout-btn" onClick={handleLogout}>Log out</button>
                </div>
              </div>
            ) : (
              <FaUser className="nav-icon auth-icon" onClick={openLogin} />
            )}
          </div>

          <Link to="/favorites" className="wishlist-icon-wrapper">
            <FaHeart className="nav-icon heart-icon" />
            {wishlistItems.length > 0 && (
              <span className="wishlist-count">{wishlistItems.length}</span>
            )}
          </Link>

          <Link to="/cart" className="cart-icon-wrapper">
            <FaShoppingBag className="nav-icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {windowWidth <= 768 && (
        <div className="mobile-search-bar">
          <FaSearch className="search-icon-left" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Search for jacket, shirt, jeans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      )}

      {/* Sidebar for mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <Link to="/men" onClick={() => setSidebarOpen(false)}>Men</Link>
        <Link to="/women" onClick={() => setSidebarOpen(false)}>Women</Link>
        <Link to="/kids" onClick={() => setSidebarOpen(false)}>Kids</Link>
        <Link to="/newborn" onClick={() => setSidebarOpen(false)}>Newborn</Link>
        <Link to="/all-products" onClick={() => setSidebarOpen(false)}>New Arrivals</Link>
        <Link to="/sale" onClick={() => setSidebarOpen(false)}>Sale</Link>
      </div>

      {/* Modals */}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal('none')}
          onSwitch={() => setModal('register')}
          onSuccess={(userData) => {
            setUser(userData);
            setModal('none');
          }}
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
