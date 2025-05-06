// backend/src/models/Order.js

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },  
  image: { 
    type: String, 
    required: true 
  }, 
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName:     { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city:         { type: String, required: true },
    postalCode:   { type: String, required: true },
    country:      { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    id:            String,
    status:        String,
    update_time:   String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Shipping', 'Delivered'],
    default: 'Confirmed'
  },
  paidAt:      Date,
  deliveredAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
