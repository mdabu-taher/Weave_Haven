// src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: ''
  },
  sizes: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // ✅ Enables createdAt and updatedAt
});

const Product = mongoose.model('Product', productSchema);

export default Product;
