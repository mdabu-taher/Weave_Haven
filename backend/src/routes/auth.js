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
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({ username, email, passwordHash });
    const savedUser = await user.save();

    // Fire-and-forget welcome email
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
      return res
        .status(409)
        .json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` });
    }
    res.status(400).json({ message: err.message });
  }
});

// ─── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Forgot Password ───────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token & expiry
    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600_000; // 1 hour
    await user.save();

    // Build reset URL and send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Weave Haven Password Reset',
      text:
        `Hi ${user.username},\n\n` +
        `You requested a password reset. Click the link below to set a new password:\n\n` +
        `${resetUrl}\n\n` +
        `If you didn’t request this, you can safely ignore this email.`,
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('⚠️ Password reset flow error:', err);
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

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
