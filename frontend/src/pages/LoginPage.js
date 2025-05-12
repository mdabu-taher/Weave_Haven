// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "../styles/LoginPage.css";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/admin');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card p-6 max-w-sm mx-auto">
        <h1 className="WelcomeMessage">👋 Welcome to Admin Panel!.</h1>
        <h2 className="WelcomeMessage">Admin Login</h2>
        <form onSubmit={handleSubmit} className="Email-Password">
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-2"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
