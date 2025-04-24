import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { signup }              = useContext(AuthContext);
  const navigate                = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/'); // go wherever
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Create Account</button>
      <p>
        Already have one? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
