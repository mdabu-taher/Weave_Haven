import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function CreateProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
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

    try {
      await axios.post('/api/auth/create-profile', formData);
      setSuccess('Profile created successfully!');
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Profile creation failed');
    }
  };

  return (
    <div className="profile-container">
      <h2>Create Your Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Middle Name (optional)</label>
        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />

        <label>Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone (with country code)</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Address (Street, City, Postal Code, Country)</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateProfile;
