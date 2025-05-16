// backend/src/routes/product.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

/**
 * POST /api/products
 * Create a new product, uploading multiple images under "photos"*/
router.post(
  '/',
  upload.array('photos', 10),
  async (req, res) => {
    console.log('🛎  POST /api/products body:', req.body);
    try {
      const {
        name,
        description = '',
        price,
        salePrice = '',
        inStock = '0',
        category,
        subCategory = '',
        sizes  = '[]',
        colors = '[]',
        material = ''
      } = req.body;

      // build photo URLs
      const photoUrls = req.files.map(f => `/uploads/${f.filename}`);

      // create new product
      const product = new Product({
        name,
        description,
        price:      parseFloat(price),
        salePrice:  salePrice ? parseFloat(salePrice) : undefined,
        inStock:    parseInt(inStock, 10),
        onSale:     Boolean(salePrice),
        category,
        subCategory,
        sizes:      JSON.parse(sizes),
        colors:     JSON.parse(colors),
        material,
        photos:     photoUrls
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
  }
);
 /* GET /api/products
 * List all products, optionally filter by category / subCategory / new-arrivals
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    const category = req.query.category?.toLowerCase();
    const subCategory = req.query.subCategory?.toLowerCase();

    if (category === 'new-arrivals') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 14);
      filter.createdAt = { $gte: cutoff };
      if (subCategory) {
        filter.category = { $regex: `^${subCategory}$`, $options: 'i' };
      }
    } else {
      if (category) filter.category = { $regex: `^${category}$`, $options: 'i' };
      if (subCategory) filter.subCategory = { $regex: `^${subCategory}$`, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/search?q=…
 * Live‐search endpoint: only matches on product.name
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query missing' });

  try {
    const regex = new RegExp(q, 'i');
    const results = await Product.find({ name: regex }).limit(10);
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

/**
 * GET /api/products/:id
 * Fetch a single product by its ID
 */
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
