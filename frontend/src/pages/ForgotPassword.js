// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';

import "../styles/Signup.css";    
import '../styles/Modal.css'; // reuse your modal styles


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Forgot Password</h2>
        {message && <div className="success">{message}</div>}
        {error   && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your account email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        <p className="close" onClick={() => (window.location = '/')}>
          Close
        </p>
      </div>
    </div>
  );
}
