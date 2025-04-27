import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  isConfirmed: { type: Boolean, default: false },
  confirmToken: { type: String },
  confirmTokenExpiry: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, default: 1, min: 1 }
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
