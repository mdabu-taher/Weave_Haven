// backend/src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  category: String,
  sizes:    [String],
  colors:   [String],
  material: String,
  image:    String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
