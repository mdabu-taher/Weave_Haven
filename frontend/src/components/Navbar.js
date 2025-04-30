import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import logo from "../assets/LOGO.png";

import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const openLogin = () => setModal('login');

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      // Don't open login modal again
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT: Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Weave Haven" className="brand-logo" />
          </Link>
        </div>

        {/* CENTER: Menu */}
        <div className="navbar-center">
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/teens">Teens</Link>
          <Link to="/newborn">Newborn</Link>
          <Link to="/all-products">New Arrivals</Link>
          <Link to="/sale">Sale</Link>
        </div>

        {/* RIGHT: Search + Icons */}
        <div className="navbar-right">
          <FaSearch className="nav-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />

          {/* User dropdown */}
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

          <Link to="/favorites">
            <FaHeart className="nav-icon heart-icon" />
          </Link>

          <Link to="/cart" className="cart-icon-wrapper">
            <FaShoppingBag className="nav-icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </nav>

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
