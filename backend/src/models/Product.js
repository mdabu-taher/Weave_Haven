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
  // optional sale price must be less than regular price if set
  salePrice: {
    type: Number,
    min: 0,
    default: null,
    validate: {
      validator: function(v) {
        // only validate when salePrice is not null
        return v == null || v < this.price;
      },
      message: props => `Sale price (${props.value}) must be below regular price`
    }
  },
  // flag to mark a product as on sale
  onSale: {
    type: Boolean,
    default: false
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
  photos: {
    // array of image URLs
    type: [String],
    default: []
  },
  countInStock: {
    // inventory count
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    // soft-delete / visibility flag
    type: Boolean,
    default: true
  }
}, {
  timestamps: true     // adds createdAt & updatedAt
});

export default mongoose.model('Product', productSchema);
