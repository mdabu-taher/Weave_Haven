// backend/src/routes/product.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';

const router = express.Router();

// Multer setup: save into /uploads at project root, preserving original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads directory exists at project root
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);       // e.g. ".webp" or ".jpg"
    cb(null, `${Date.now()}${ext}`);                    // e.g. "1682912345678.webp"
  }
});
const upload = multer({ storage });

// Create / Upload product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description = '',
      price,
      category,
      sizes = '[]',
      colors = '[]',
      material = ''
    } = req.body;

    // Build the URL path including /uploads/ and the extension
    const imageUrl = `/uploads/${req.file.filename}`;    // "/uploads/1682912345678.webp"

    const product = new Product({
      name,
      description,
      price,
      category,
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
      material,
      image: imageUrl
    });

    await product.save();
    res.status(201).json({
      message: 'Product uploaded successfully',
      product
    });
  } catch (err) {
    console.error('Product upload error:', err);
    res.status(500).json({ message: 'Failed to upload product' });
  }
});

// List all or by-category
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Search products by name
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query missing' });

  try {
    const regex = new RegExp(q, 'i'); // case-insensitive match
    const results = await Product.find({ name: regex });
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;
