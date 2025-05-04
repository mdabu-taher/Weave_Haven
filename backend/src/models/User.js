// backend/src/models/User.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  fullName:       { type: String,  required: true, trim: true },
  username:       { type: String,  required: true, unique: true, trim: true },
  email:          { type: String,  required: true, unique: true, lowercase: true, trim: true },
  passwordHash:   { type: String,  required: true },
  gender:         { type: String,  required: true, enum: ['male', 'female'] },

  phone:          { type: String,  trim: true },
  address:        { type: String,  trim: true },
  role:           { type: String,  enum: ['user', 'seller', 'admin'], default: 'user' },

  // Email confirmation
  isConfirmed:         { type: Boolean, default: false },
  confirmToken:        { type: String },
  confirmTokenExpiry:  { type: Date },

  // Password reset
  resetToken:          { type: String },
  resetTokenExpiry:    { type: Date },

  // Cart & Wishlist
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty:     { type: Number, default: 1, min: 1 }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

/**
 * Generate an email confirmation token.
 * Stores a SHA256 hash in the DB and returns the raw token.
 */
userSchema.methods.generateEmailConfirmToken = function() {
  const rawToken = crypto.randomBytes(20).toString('hex');
  this.confirmToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');
  this.confirmTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return rawToken;
};

/**
 * Generate a password reset token.
 * Stores a SHA256 hash in the DB and returns the raw token.
 */
userSchema.methods.generatePasswordResetToken = function() {
  const rawToken = crypto.randomBytes(20).toString('hex');
  this.resetToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');
  this.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1h
  return rawToken;
};

const User = mongoose.model('User', userSchema);
export default User;
