// src/components/WelcomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css'; // Ensure the CSS file exists

export default function WelcomePage() {
  const navigate = useNavigate();

  // Navigate to login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Navigate to registration page
  const handleSignupClick = () => {
    navigate('/register');
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <h1 className="welcome-message">Welcome to Weave Haven</h1>
        <p className="welcome-subtext">
          Explore our curated collection of premium fabrics and exclusive designs.
        </p>
        <div className="welcome-buttons">
          <button onClick={handleLoginClick}>Login</button>
          <button onClick={handleSignupClick}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
