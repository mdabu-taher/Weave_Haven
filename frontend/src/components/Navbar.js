// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // modal state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // when user icon clicked
  const handleUserClick = () => {
    setShowLogin(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">Weave Haven</Link>
        </div>
        <div className="navbar-center">
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/teens">Teens</Link>
          <Link to="/newborn">Newborn</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/sale">Sale</Link>
        </div>
        <div className="navbar-right">
          <FaSearch className="nav-icon" />
          {/* clicking this opens login modal */}
          <FaUser className="nav-icon" onClick={handleUserClick} />
          <FaHeart className="nav-icon" />
          <Link to="/cart" className="cart-icon-wrapper">
            <FaShoppingBag className="nav-icon" />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </Link>
        </div>
      </nav>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitch={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
