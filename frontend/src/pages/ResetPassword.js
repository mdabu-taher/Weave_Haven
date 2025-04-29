import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Modal.css'; // or any stylesheet you like

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password: form.password }
      );
      setSuccess(res.data.message);
      // after a moment, redirect to login or home
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Reset Your Password</h2>
        {error   && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Set New Password</button>
          </form>
        )}

        <p className="close" onClick={() => navigate('/')}>
          Close
        </p>
      </div>
    </div>
  );
}
