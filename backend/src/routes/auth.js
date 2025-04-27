import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user document
    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Return only non‐sensitive fields
    return res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    });
  } catch (err) {
    // Duplicate email
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(409)
        .json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` });
    }
    // Other validation or server error
    return res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    // On success, send back user info (or a token in a real app)
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
