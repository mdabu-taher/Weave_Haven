import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ✅ Upload product
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

// ✅ Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ✅ Search products by query string
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query missing' });

  try {
    const regex = new RegExp(q, 'i'); // case-insensitive match
    const results = await Product.find({ name: regex });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;
