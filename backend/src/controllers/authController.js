// backend/src/controllers/authController.js

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
export async function getMe(req, res) {
  try {
    // protect middleware should have attached req.user already
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const { _id: id, name, email, role } = req.user;
    return res.json({ id, name, email, role });
  } catch (err) {
    console.error('❌ getMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/auth/login
 * Authenticate user and set a cookie.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1) Find the user
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2) Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3) Sign a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 4) Set it on a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only over HTTPS
      sameSite: 'none',                              // required for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,               // 1 week
    });

    // 5) Return user info (sans password)
    const { _id: id, name, role } = user;
    return res.json({ id, name, email, role });
  } catch (err) {
    console.error('❌ login error:', err);
    return res.status(500).json({ message: 'Server error logging in' });
  }
}

/**
 * POST /api/auth/signup
 * Register a new user and set a cookie.
 */
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1) Prevent duplicate emails
    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 2) Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3) Create user
    const user = await User.create({ name, email, passwordHash });

    // 4) Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 5) Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6) Return user
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('❌ signup error:', err);
    return res.status(500).json({ message: 'Server error signing up' });
  }
}

/**
 * POST /api/auth/logout
 * Clear the auth cookie.
 */
export async function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  return res.sendStatus(204);
}
