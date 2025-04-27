// frontend/src/pages/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';  // reuse your auth-form styles

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Forgot Password</h2>

      {message && <p className="success">{message}</p>}
      {error   && <p className="error">{error}</p>}

      <div className="form-group">
        <label htmlFor="email">Enter your account email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send Reset Link'}
      </button>
    </form>
  );
}
