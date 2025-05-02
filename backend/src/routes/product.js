import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const router = express.Router();

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup: save into /uploads at project root
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

// Create / Upload product
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

    res.status(201).json({
      message: 'Product uploaded successfully',
      product
    });
  } catch (err) {
    console.error('Product upload error:', err);
    res.status(500).json({ message: 'Failed to upload product' });
  }
});

// List all or by category and subCategory
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      const cat = req.query.category.toLowerCase();

      if (cat === 'new-arrivals') {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        filter.createdAt = { $gte: twoWeeksAgo };
      } else {
        filter.category = new RegExp(`^${req.query.category}$`, 'i');
      }
    }

    if (req.query.subCategory) {
      filter.subCategory = new RegExp(`^${req.query.subCategory}$`, 'i');
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// 🔍 Search by name, category, or subCategory
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query missing' });

  try {
    const regex = new RegExp(q, 'i'); // case-insensitive
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

// Get product by ID
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
