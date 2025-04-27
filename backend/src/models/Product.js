// backend/src/routes/product.js
import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    // parse prices only when they’re non-empty and valid numbers
    if (minPrice && !isNaN(minPrice)) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (maxPrice && !isNaN(maxPrice)) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Error in GET /api/products:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
