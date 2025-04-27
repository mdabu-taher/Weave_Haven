import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function UpdateProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await axios.get('/api/auth/profile', { withCredentials: true });
        setFormData(prev => ({
          ...prev,
          fullName: res.data.fullName,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone || '',
          address: res.data.address || '',
        }));
      } catch (err) {
        setError('Failed to load profile');
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await axios.put('/api/auth/profile', {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        oldPassword: formData.currentPassword,
      }, { withCredentials: true });

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

        <label>Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

        <label>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <label>Current Password (required to update)</label>
        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
