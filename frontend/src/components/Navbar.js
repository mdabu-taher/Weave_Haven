// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import logo from "../assets/LOGO.png";   // adjust name if you rename the file


import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

export default function Navbar() {
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState('none'); // 'none' | 'login' | 'register'

  // on mount, check login
  useEffect(() => {
    axios.get('/api/auth/profile', { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const openLogin = () => {
    setModal('login');
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
    setModal('login');
  };

  return (
    <>
      <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Weave Haven" className="brand-logo" />
        </Link>
      </div>
        <div className="navbar-center">
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/teens">Teens</Link>
          <Link to="/newborn">Newborn</Link>
          <Link to="/all-products">New Arrivals</Link>
          <Link to="/sale">Sale</Link>
        </div>

        <div className="navbar-right">
          <FaSearch className="nav-icon" />
          {/* ALWAYS open login/register, never go to /profile directly */}
          <FaUser className="nav-icon auth-icon" onClick={openLogin} />

          <FaHeart className="nav-icon heart-icon" />

          <Link to="/cart" className="cart-icon-wrapper">
            <FaShoppingBag className="nav-icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </nav>

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
