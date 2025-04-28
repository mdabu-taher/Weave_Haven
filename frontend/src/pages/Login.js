import React, { useState, useContext } from 'react';
import { Link, useNavigate }            from 'react-router-dom';
import { AuthContext }                  from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const { login }   = useContext(AuthContext);
  const navigate    = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <header className="site-header">
        <div className="logo">
          <img src="Picture1.png" alt="Weave Haven Logo" />
          <span>Weave Haven</span>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <div className="login-container">
        <div className="login-card">
          <h1>Log In</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit">Log In</button>
          </form>
          <div className="links">
            <Link to="/forgot-password">Forgot password?</Link>
            <span className="divider">|</span>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
