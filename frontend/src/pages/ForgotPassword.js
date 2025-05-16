import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Modal.css';
import { forgotPassword } from '../utils/api';  // ← import helper

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // ← use the shared helper instead of axios.post
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset link');
    }
  };

  const handleClose = () => {
    navigate('/login');
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

        <p className="close" onClick={handleClose}>
          Close
        </p>
      </div>
    </div>
  );
}
