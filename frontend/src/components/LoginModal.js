// src/components/LoginModal.js
import React, { useState } from 'react';
import '../styles/Modal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, onSwitch, onSuccess }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('SUBMIT: sending login', form);
      const { data } = await axios.post(
        '/api/auth/login',
        form,
        { withCredentials: true }
      );
      console.log('LOGIN SUCCESS, user:', data);

      // Notify parent
      onSuccess(data);

      // Close and redirect (if parent doesn't)
      onClose();
      navigate('/');

      // Prevent fall‑through to catch
      return;
    } catch (err) {
      console.error('LOGIN ERROR:', err.response || err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <p
            className="link"
            style={{ margin: '5px 0', fontSize: '0.9rem' }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </p>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
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
