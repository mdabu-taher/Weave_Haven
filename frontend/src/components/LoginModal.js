// src/components/LoginModal.js
import React, { useState } from 'react';
import '../styles/Modal.css';
import axios from 'axios';

function LoginModal({ onClose, onSwitch }) {
  const [form, setForm]     = useState({ identifier: '', password: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/auth/login', form, { withCredentials: true });
      setSuccess('Login successful! Redirecting...');
      // short delay then reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login to Weave Haven</h2>

        {success && <div className="success">{success}</div>}
        {error   && <div className="error">{error}</div>}

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
            style={{ margin: '5px 0', fontSize: '0.9rem' }}
            onClick={() => {
              onClose();
              window.location.href = '/forgot-password';
            }}
          >
            Forgot Password?
          </p>

          <button type="submit">Login</button>
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

export default LoginModal;
