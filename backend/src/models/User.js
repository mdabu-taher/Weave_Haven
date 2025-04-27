// backend/src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role:     { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty:     { type: Number, default: 1, min: 1 }
    }
  ],
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
