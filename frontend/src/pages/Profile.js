import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css'; // Make sure your CSS is still imported

function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get('/api/auth/profile', { withCredentials: true });
        setProfile((prev) => ({
          ...prev,
          fullName: res.data.fullName,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone || '',
          address: res.data.address || '',
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const updateData = {
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      };

      if (profile.oldPassword && profile.newPassword) {
        updateData.oldPassword = profile.oldPassword;
        updateData.newPassword = profile.newPassword;
      }

      await axios.put('/api/auth/profile', updateData, { withCredentials: true });

      setSuccess('Profile updated successfully!');
      setProfile((prev) => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return (
    <div className="profile-container">
      <h2>Loading your profile...</h2>
    </div>
  );

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          required
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleChange}
        />

        <label>Old Password</label>
        <input
          type="password"
          name="oldPassword"
          value={profile.oldPassword}
          onChange={handleChange}
          placeholder="Enter old password to change password"
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={profile.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={profile.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
        />

        <button type="submit">Update Profile</button>
      </form>

      {/* Navigation Buttons */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/update-profile">
          <button style={{ margin: '10px' }}>Update Full Profile</button>
        </Link>
        <Link to="/change-password">
          <button style={{ margin: '10px' }}>Change Password</button>
        </Link>
        <Link to="/delete-account">
          <button style={{ margin: '10px', backgroundColor: 'red', color: 'white' }}>
            Delete Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
