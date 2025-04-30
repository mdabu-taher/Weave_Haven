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

  description: {
    type: String,
    default: ''
  },

  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Define and export the model
const Product = mongoose.model('Product', productSchema);
export default Product;