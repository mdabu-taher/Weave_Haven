import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import Cart Context
import axios from 'axios'; // Import axios
import '../styles/Navbar.css'; // Import your CSS

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Get cartItems to show count

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
      <div className="navbar-logo">
        <Link to="/">Weave Haven</Link> {/* Brand Name */}
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/cart">Cart ({cartItems.length})</Link></li> {/* Show cart count */}
        <li><Link to="/profile">Profile</Link></li>
        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
