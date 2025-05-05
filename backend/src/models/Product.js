import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subCategory: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  material: {
    type: String,
    default: '',
    trim: true
  },
  sizes: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    default: []
  },
  photos: {            // array of image URLs
    type: [String],
    default: []
  },
  countInStock: {      // inventory count
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {          // soft-delete / visibility flag
    type: Boolean,
    default: true
  }
}, {
  timestamps: true     // createdAt & updatedAt
});

const Product = mongoose.model('Product', productSchema);
export default Product;
