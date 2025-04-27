import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = (mailOptions) =>
  transporter.sendMail({
    from: process.env.SMTP_FROM,
    ...mailOptions,
  });

// ─── Register + Welcome Email ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ username, email, passwordHash });
    const savedUser = await user.save();

    sendMail({
      to: savedUser.email,
      subject: `Welcome to Weave Haven, ${savedUser.username}!`,
      text: `Hi ${savedUser.username},\n\nThanks for signing up at Weave Haven!`,
    }).catch(err => console.error('⚠️ Welcome email failed:', err));

    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    });

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` });
    }
    res.status(400).json({ message: err.message });
  }
});

// ─── Create Full Profile ─────────────────────────────────────────────────────
router.post('/create-profile', async (req, res) => {
  const { firstName, middleName, lastName, username, email, phone, address, password, confirmPassword } = req.body;

  try {
    if (!firstName || !lastName || !username || !email || !phone || !address || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or Email already taken' });
    }

    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      phone,
      address,
      passwordHash
    });

    await newUser.save();

    res.status(201).json({ message: 'Profile created successfully!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Login and Set Token ───────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// ─── Forgot Password ───────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600_000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Weave Haven Password Reset',
      text: `Hi ${user.username},\n\nReset your password here:\n\n${resetUrl}`,
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing password reset' });
  }
});

// ─── Reset Password ────────────────────────────────────────────────────────────
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get User Profile ──────────────────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Update User Profile ───────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = req.body.fullName || user.fullName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.oldPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(req.body.newPassword, salt);
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Change Password ───────────────────────────────────────────────────────────
router.put('/change-password', async (req, res) => {
  const { usernameOrEmail, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Delete Account ────────────────────────────────────────────────────────────
router.delete('/delete-account', protect, async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    await User.deleteOne({ _id: req.user._id });

    res.clearCookie('token');
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
