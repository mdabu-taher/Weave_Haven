import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ✅ Upload product (already working)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      name, description, price, category,
      sizes, colors, material
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
      material,
      image: req.file.filename
    });

    await product.save();
    res.status(201).json({ message: 'Product uploaded successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload product' });
  }
});

// ✅ New route: Get all uploaded products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

export default router;
