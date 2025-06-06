// src/components/RegisterModal.jsx

import React, { useState } from 'react';
import '../styles/RegisterModal.css';
import { register } from '../utils/api';

export default function RegisterModal({ onClose, onSwitch, onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = pwd =>
    /[a-z]/.test(pwd) &&
    /[A-Z]/.test(pwd) &&
    /\d/.test(pwd) &&
    pwd.length >= 8;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.gender) {
      return setError('Please select your gender');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!validatePassword(form.password)) {
      return setError(
        'Password must include upper, lower, number and be at least 8 characters'
      );
    }

    try {
      const user = await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        gender: form.gender,
        password: form.password
      });
      setSuccessMsg('Registration successful! Please check your email to confirm.');
      if (onSuccess) onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal register-modal">
        <h2>Create an Account</h2>
        {error && <div className="error">{error}</div>}
        {successMsg && <div className="success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="mobile"
            placeholder="Mobile number (include +XX)"
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <div className="gender-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === 'male'}
                onChange={handleChange}
                required
              />{' '}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === 'female'}
                onChange={handleChange}
                required
              />{' '}
              Female
            </label>
            
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="registerbutton">
            Create Account
          </button>
        </form>

        <p className="link" onClick={onSwitch}>
          Already have an account? Login
        </p>
        <p className="close" onClick={onClose}>
          Close
        </p>
      </div>
    </div>
);
}
