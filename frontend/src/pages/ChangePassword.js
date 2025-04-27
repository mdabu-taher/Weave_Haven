import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function ChangePassword() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      await axios.put('/api/auth/change-password', {
        usernameOrEmail: formData.usernameOrEmail,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setSuccess('Password changed successfully!');
      setFormData({
        usernameOrEmail: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="profile-container">
      <h2>Change Password</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Username or Email</label>
        <input type="text" name="usernameOrEmail" value={formData.usernameOrEmail} onChange={handleChange} required />

        <label>Old Password</label>
        <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required />

        <label>New Password</label>
        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />

        <label>Confirm New Password</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
