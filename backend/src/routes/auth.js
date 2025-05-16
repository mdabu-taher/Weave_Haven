// backend/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

dotenv.config();
const router = express.Router();

// ─── SMTP transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const sendMail = opts =>
  transporter.sendMail({ from: process.env.SMTP_FROM, ...opts });

// ─── Register + Welcome Email ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { fullName, username, email, mobile, password, gender } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      username,
      email,
      phone: mobile,
      gender,
      passwordHash,
    });

    // Email confirmation token
    const confirmToken = user.generateEmailConfirmToken();
    await user.save();

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${confirmToken}`;
    await sendMail({
      to: user.email,
      subject: `Welcome to Weave Haven, ${user.fullName}!`,
      text:
        `Hi ${user.fullName},\n\n` +
        `Thanks for joining Weave Haven. Confirm your email here:\n` +
        `${confirmUrl}\n\n` +
        `If you didn't sign up, ignore this.\n\n` +
        `— Team Weave Haven`
    });

    res.status(201).json({
      id:       user._id,
      fullName: user.fullName,
      username: user.username,
      email:    user.email,
      phone:    user.phone,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(409)
        .json({ message: `${field.charAt(0).toUpperCase()}${field.slice(1)} already in use` });
    }
    res.status(400).json({ message: err.message });
  }
});

// ─── Email confirmation ──────────────────────────────────────────────────────
router.get('/confirm-email/:token', async (req, res) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      confirmToken: tokenHash,
      confirmTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isConfirmed = true;
    user.confirmToken = undefined;
    user.confirmTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Email confirmed! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  // Accept either `identifier` or `email` from the client:
  const identifier = req.body.identifier || req.body.email;
  const { password } = req.body;

  console.log('Login payload:', { identifier, password: password ? '•••••' : null });

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier }
      ]
    });

    if (!user) {
      console.log('No matching user found for identifier:', identifier);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('Invalid password for user:', identifier);
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    // Set JWT cookie for cross-site usage
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      id:        user._id,
      fullName:  user.fullName,
      username:  user.username,
      email:     user.email,
      phone:     user.phone,
      role:      user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Logout ──────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ message: 'Logged out successfully' });
});

// ─── Forgot Password ────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rawToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    await sendMail({
      to:      user.email,
      subject: 'Weave Haven Password Reset',
      html: `
        <p>Hi ${user.username},</p>
        <p>Click below to choose a new password:</p>
        <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore.</p>
        <br/>
        <p>— Team Weave Haven</p>
      `
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Reset Password ─────────────────────────────────────────────────────────
router.post('/reset-password/:token', async (req, res) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetToken:       tokenHash,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Verify Reset Token ──────────────────────────────────────────────────────
router.get('/reset-password/:token', async (req, res) => {
  try {
    const tokenHash = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetToken:       tokenHash,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    res.json({ message: 'Token valid' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Profile routes (protected) ─────────────────────────────────────────────
router.get('/profile', protect, (req, res) => {
  const {
    _id, fullName, username, email, phone,
    address, role, createdAt
  } = req.user;
  res.json({
    id:        _id,
    fullName,
    username,
    email,
    phone,
    address,
    role,
    createdAt
  });
});

// ─── Update Profile ──────────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    ['fullName','username','email','phone','address'].forEach(f => {
      if (req.body[f]) user[f] = req.body[f];
    });
    if (req.body.oldPassword && req.body.newPassword) {
      const ok = await bcrypt.compare(req.body.oldPassword, user.passwordHash);
      if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
      user.passwordHash = await bcrypt.hash(
        req.body.newPassword,
        await bcrypt.genSalt(10)
      );
    }
    const u = await user.save();
    const { _id, fullName, username, email, phone, address, role, createdAt } = u;
    res.json({ id: _id, fullName, username, email, phone, address, role, createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Delete Account ─────────────────────────────────────────────────────────
router.delete('/delete-account', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Incorrect password' });
    await User.deleteOne({ _id: user._id });
    res.clearCookie('token').json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
