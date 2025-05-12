import React, { useState } from 'react';
import '../styles/Modal.css';
import axios from 'axios';
import bgImage from '../assets/login_bg.png'; // Path to your background image

export default function LoginModal({ onClose, onSwitch, onSuccess }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', form, { withCredentials: true });
      const profile = await axios.get('/api/auth/profile', { withCredentials: true });
      onSuccess(profile.data);
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
            style={{ margin: '5px 0', fontSize: '0.9rem' }}
            onClick={() => {
              onClose();
              window.location.href = '/forgot-password';
            }}
          >
            Forgot Password?
          </p>

          <button type="submit" className='loginbutton'>Login</button>
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
