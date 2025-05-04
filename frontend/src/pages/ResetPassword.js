// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  const { token } = useParams();

  const [status, setStatus] = useState('loading'); // 'loading' | 'valid' | 'invalid'
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  // 1) Verify token on mount
  useEffect(() => {
    axios
      .get(`/api/auth/reset-password/${token}`)
      .then(() => setStatus('valid'))
      .catch(() => setStatus('invalid'));
  }, [token]);

  if (status === 'loading') return <p>Checking link…</p>;
  if (status === 'invalid') return <p>Invalid or expired reset link.</p>;

  // 2) Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Your Password</h2>
      {message && (
        <p className="info">
          {message}
          {message === 'Password reset successful!' && (
            <>
              {' '}
              <Link to="/login">Go to Login</Link>
            </>
          )}
        </p>
      )}
      {message !== 'Password reset successful!' && (
        <form onSubmit={onSubmit}>
          <label>
            New Password<br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Confirm Password<br />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
}
