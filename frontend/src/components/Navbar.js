import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">Weave Haven</Link>
      </div>

      {/* Center - Menu */}
      <div className="navbar-center">
        <Link to="/men">Men</Link>
        <Link to="/women">Women</Link>
        <Link to="/kids">Kids</Link>
        <Link to="/teens">Teens</Link>
        <Link to="/newborn">Newborn</Link>
        <Link to="/new-arrivals">New Arrivals</Link>
        <Link to="/sale">Sale</Link>
      </div>

      {/* Right - Icons */}
      <div className="navbar-right">
        <FaSearch className="nav-icon" />
        <Link to="/profile"><FaUser className="nav-icon" /></Link>
        <FaHeart className="nav-icon" />
        <Link to="/cart" className="cart-icon-wrapper">
          <FaShoppingBag className="nav-icon" />
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;