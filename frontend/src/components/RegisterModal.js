// src/components/RegisterModal.js
import React, { useState } from 'react';
import '../styles/Modal.css';
import axios from 'axios';

function RegisterModal({ onClose, onSwitch }) {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Password complexity validator
  const validatePassword = pwd =>
    /[a-z]/.test(pwd) &&
    /[A-Z]/.test(pwd) &&
    /\d/.test(pwd) &&
    pwd.length >= 8;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1) Gender required
    if (!form.gender) {
      return setError('Please select your gender');
    }

    // 2) Passwords match + complexity
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!validatePassword(form.password)) {
      return setError(
        'Password must include upper, lower, number and be at least 8 characters'
      );
    }

    try {
      const res = await axios.post(
        '/api/auth/register',
        {
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          gender: form.gender
        },
        { withCredentials: true }
      );

      // 3) Show success message (backend also sent confirmation email)
      setSuccess(
        `Thanks for registering, ${res.data.fullName}!  
         Please check your email (${res.data.email}) for a confirmation link.`
      );

      // 4) Optionally close after a delay:
      // setTimeout(onClose, 4000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Register to Weave Haven</h2>

        {success && <div className="success">{success}</div>}
        {error   && <div className="error">{error}</div>}

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

          {/* Gender */}
          <div className="gender-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === 'male'}
                onChange={handleChange}
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

          <button type="submit">Create Account</button>
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

export default RegisterModal;
