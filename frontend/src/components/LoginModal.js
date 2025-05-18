import React, { useState } from 'react';
import '../styles/Modal.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ onClose, onSwitch }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Perform login and populate AuthContext.user
      await login(form);

      // Close this modal
      onClose();

      // Redirect to orders page
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login to Weave Haven</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Email, mobile or username"
            value={form.identifier}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <p
            className="link"
            onClick={() => {
              onClose();
              navigate('/forgot-password');
            }}
          >
            Forgot Password?
          </p>
          <button type="submit" className="loginbutton">
            Login
          </button>
        </form>

        <p className="link" onClick={onSwitch}>
          Don't have an account? Register
        </p>
        <p className="close" onClick={onClose}>
          Close
        </p>
      </div>
    </div>
  );
}
