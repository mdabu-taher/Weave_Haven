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

// ─── Instance method: generate email confirmation token ────────────────────
userSchema.methods.generateEmailConfirmToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.confirmToken       = token;
  this.confirmTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// ─── Instance method: generate password reset token ───────────────────────
userSchema.methods.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetToken       = token;
  this.resetTokenExpiry = Date.now() + 3600_000; // 1 hour
  return token;
};

const User = mongoose.model('User', userSchema);
export default User;
