// backend/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Register + Welcome Email ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const newUser = new User({ username, email, passwordHash: hashedPassword });
    const savedUser = await newUser.save();

    // Attempt welcome email (errors logged but do not block response)
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: savedUser.email,
        subject: `Welcome to Weave Haven, ${savedUser.username}!`,
        text: `Hi ${savedUser.username},\n\nThanks for signing up at Weave Haven!`,
      });
    } catch (emailErr) {
      console.error('⚠️ Welcome email failed:', emailErr);
    }

    // Always return success
    return res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    });

  } catch (err) {
    // Handle duplicate email
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(409)
        .json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` });
    }
    // Other errors
    return res.status(400).json({ message: err.message });
  }
});

// ─── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─── Forgot Password ───────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    // Generate token and expiry
    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600_000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Weave Haven Password Reset',
      text: `Click here to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    });

    return res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: 'Password successfully updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
