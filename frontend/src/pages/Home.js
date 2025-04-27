import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Weave Haven</h1>
      <p>Your one-stop shop for beautiful fashion and accessories!</p>

      <div className="home-buttons">
        <Link to="/create-profile">
          <button className="home-button">Create Account</button>
        </Link>

        <Link to="/login">
          <button className="home-button">Login</button>
        </Link>

        <Link to="/products">
          <button className="home-button">Explore Products</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
