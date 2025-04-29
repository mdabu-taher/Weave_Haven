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
  description: {
    type: String
  },
  image: {
    type: String
  }
});

// ✅ Define the model
const Product = mongoose.model('Product', productSchema);

// ✅ Export it
export default Product;
