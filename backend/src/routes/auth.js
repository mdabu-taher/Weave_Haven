import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const sendMail = opts => transporter.sendMail({ from: process.env.SMTP_FROM, ...opts });

// ─── Register + Welcome Email ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { fullName, username, email, mobile, password, gender } = req.body;
  try {
    // 1) Hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2) Create & save
    const user = new User({
      fullName,
      username,
      email,
      phone: mobile,
      gender,
      passwordHash,
    });
    const savedUser = await user.save();

    // 3) Welcome email
    await sendMail({
      to: savedUser.email,
      subject: `Welcome to Weave Haven, ${savedUser.fullName}!`,
      text:
        `Hi ${savedUser.fullName},\n\n` +
        `Thank you for joining the Weave Haven community–we’re excited to have you.\n\n` +
        `Please confirm your email by clicking the link below:\n` +
        `${process.env.FRONTEND_URL}/confirm-email/${savedUser.generateEmailConfirmToken()}\n\n` +
        `If you didn't sign up, just ignore this.\n\n` +
        `Best regards,\nTeam Weave Haven`
    });
    await savedUser.save(); // persist confirmToken & expiry

    // 4) Respond
    res.status(201).json({
      id: savedUser._id,
      fullName: savedUser.fullName,
      username: savedUser.username,
      email: savedUser.email,
      phone: savedUser.phone,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(409)
        .json({ message: `${field.charAt(0).toUpperCase()+field.slice(1)} already in use` });
    }
    res.status(400).json({ message: err.message });
  }
});

// ─── Email confirmation endpoint ────────────────────────────────────────────
router.get('/confirm-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      confirmToken: req.params.token,
      confirmTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.isConfirmed = true;
    user.confirmToken = undefined;
    user.confirmTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Email confirmed! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Login (by email, username or phone) ───────────────────────────────────
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // issue JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV==='production',
      sameSite: 'strict',
      maxAge: 24*60*60*1000
    });
    res.json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Logout ────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV==='production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
});

// ─── Forgot Password ────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // generate reset token
    const token = user.generatePasswordResetToken();
    await user.save();

    // send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Weave Haven Password Reset',
      text:
        `Hi ${user.username},\n\n` +
        `Reset your password here:\n${resetUrl}\n\n` +
        `Expires in 1 hour.\n\n` +
        `Best regards,\nTeam Weave Haven`
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Reset Password ─────────────────────────────────────────────────────────
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // hash new password
    user.passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Protect middleware ─────────────────────────────────────────────────────
import { protect } from '../middleware/auth.js';

// ─── Profile routes ────────────────────────────────────────────────────────
router.get('/profile', protect, (req, res) => {
  const { _id, fullName, username, email, phone, address } = req.user;
  res.json({ id: _id, fullName, username, email, phone, address });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    ['fullName','username','email','phone','address'].forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });
    if (req.body.oldPassword && req.body.newPassword) {
      const ok = await bcrypt.compare(req.body.oldPassword, user.passwordHash);
      if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
      user.passwordHash = await bcrypt.hash(req.body.newPassword, await bcrypt.genSalt(10));
    }
    const u = await user.save();
    const { _id, fullName, username, email, phone, address } = u;
    res.json({ id: _id, fullName, username, email, phone, address });
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
