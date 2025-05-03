import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const router = express.Router();

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// POST /api/products – Add new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description = '',
      price,
      category,
      subCategory = '',
      sizes = '[]',
      colors = '[]',
      material = ''
    } = req.body;

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
      material,
      image: imageUrl
    });

    await product.save();

    res.status(201).json({ message: 'Product uploaded successfully', product });
  } catch (err) {
    console.error('Product upload error:', err);
    res.status(500).json({ message: 'Failed to upload product' });
  }
});

// GET /api/products – Get all, category, subCategory or new-arrivals
router.get('/', async (req, res) => {
  try {
    const filter = {};
    const category = req.query.category?.toLowerCase();
    const subCategory = req.query.subCategory?.toLowerCase();

    if (category === 'new-arrivals') {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      filter.createdAt = { $gte: twoWeeksAgo };

      if (subCategory) {
        filter.category = { $regex: `^${subCategory}$`, $options: 'i' };
      }
    } else {
      if (category) {
        filter.category = { $regex: `^${category}$`, $options: 'i' };
      }
      if (subCategory) {
        filter.subCategory = { $regex: `^${subCategory}$`, $options: 'i' };
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/search?q=query – Search products
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query missing' });

  try {
    const regex = new RegExp(q, 'i');
    const results = await Product.find({
      $or: [
        { name: regex },
        { category: regex },
        { subCategory: regex }
      ]
    });
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

// GET /api/products/:id – Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Fetch product by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

export default router;
