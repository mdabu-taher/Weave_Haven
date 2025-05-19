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

//REGISTER (with email confirmation)
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

    const confirmToken = user.generateEmailConfirmToken();
    await user.save();

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${confirmToken}`;

    const textBody = 
      `Hi ${user.fullName},\n\n` +
      `Welcome to Weave Haven! Thank you for creating an account with us.\n\n` +
      `Please confirm your email address by clicking the link below:\n` +
      `${confirmUrl}\n\n` +
      `If you did not register for a Weave Haven account, simply ignore this message.\n\n` +
      `Happy weaving,\n` +
      `The Weave Haven Team`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #444;">Welcome to Weave Haven, ${user.fullName}!</h2>
        <p>Thank you for joining our community of makers and creators.</p>
        <p>To get started, please confirm your email address by clicking the button below:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a
            href="${confirmUrl}"
            style="
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 4px;
              display: inline-block;
            "
          >
            Confirm Your Email
          </a>
        </p>
        <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">
          <a href="${confirmUrl}" style="color: #0066cc;">${confirmUrl}</a>
        </p>
        <p style="margin-top: 30px; color: #777; font-size: 0.9em;">
          If you didn’t create an account with us, please disregard this email.
        </p>
        <p style="color: #777; font-size: 0.9em;">
          — The Weave Haven Team
        </p>
      </div>
    `;

    await sendMail({
      to:      user.email,
      subject: `Welcome to Weave Haven, ${user.fullName}!`,
      message: textBody,
      html:    htmlBody
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
        .json({ message: `${field.charAt(0).toUpperCase()+field.slice(1)} already in use` });
    }
    res.status(400).json({ message: err.message });
  }
});

//EMAIL CONFIRMATION
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

//LOGIN
router.post('/login', async (req, res) => {
  const identifier = req.body.identifier || req.body.email;
  const { password } = req.body;
  console.log('Login attempt for:', identifier);

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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

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
});

//LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ message: 'Logged out successfully' });
});

//FORGOT / RESET PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rawToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    const resetEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #444;">Weave Haven Password Reset</h2>
        <p>Hi ${user.fullName},</p>
        <p>We received a request to reset the password for your Weave Haven account. Click the button below to set a new password:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a
            href="${resetUrl}"
            style="
              background-color: #28a745;
              color: #fff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 4px;
              display: inline-block;
            "
          >
            Reset Your Password
          </a>
        </p>
        <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">
          <a href="${resetUrl}" style="color: #0066cc;">${resetUrl}</a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 0.9em; color: #777;">
          If you didn’t request a password reset, you can safely ignore this email.  
          For further assistance, reply to this email or contact our support team at  
          <a href="mailto:support@weavehaven.com">support@weavehaven.com</a>.
        </p>
        <p style="font-size: 0.9em; color: #777;">
          Thanks,<br/>
          The Weave Haven Team
        </p>
      </div>
    `;

    await sendMail({
      to:      user.email,
      subject: 'Weave Haven Password Reset',
      html:    resetEmailHtml
    });


    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reset-password/:token', async (req, res) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetToken: tokenHash, resetTokenExpiry: { $gt: Date.now() }});
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    res.json({ message: 'Token valid' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetToken: tokenHash, resetTokenExpiry: { $gt: Date.now() }});
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PROFILE ROUTES (protected)
router.get('/profile', protect, (req, res) => {
  const { _id, fullName, username, email, phone, address, role, createdAt } = req.user;
  res.json({ id: _id, fullName, username, email, phone, address, role, createdAt });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    ['fullName','username','email','phone','address'].forEach(f => {
      if (req.body[f]) user[f] = req.body[f];
    });
    if (req.body.oldPassword && req.body.newPassword) {
      const ok = await bcrypt.compare(req.body.oldPassword, user.passwordHash);
      if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
      user.passwordHash = await bcrypt.hash(req.body.newPassword, await bcrypt.genSalt(10));
    }
    const u = await user.save();
    const { _id, fullName, username, email, phone, address, role, createdAt } = u;
    res.json({ id: _id, fullName, username, email, phone, address, role, createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
