import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!window.confirm('Are you sure? This action will permanently delete your account.')) {
      return;
    }

    try {
      await axios.delete('/api/auth/delete-account', {
        data: { password },
        withCredentials: true,
      });

      setSuccess('Account deleted successfully! You will be logged out.');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Account deletion failed');
    }
  };

  return (
    <div className="profile-container">
      <h2>Delete Account</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Enter Password to Confirm</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={{ backgroundColor: 'red' }}>
          Delete My Account
        </button>
      </form>
    </div>
  );
}

export default DeleteAccount;
