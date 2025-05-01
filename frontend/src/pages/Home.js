import React from 'react';
import '../styles/Home.css';
import bgImage from '../assets/Hero-bg.webp'; // adjust path if needed

function Home() {
  return (
    <div className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
      <h1>Welcome to Weave Haven</h1>
      <p>Your one-stop shop for beautiful fashion!</p>
    </div>
  );
}

export default Home;
