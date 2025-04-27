// backend/src/controllers/productController.js
import Product from '../models/Product.js';

// Create a new product (with optional file upload)
export async function createProduct(req, res) {
  try {
    const { name, price, category, sizes, colors, material } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      name,
      description: req.body.description || '',  // include description if used
      price: Number(price),
      category,
      sizes: sizes ? sizes.split(',') : [],
      colors: colors ? colors.split(',') : [],
      material,
      image: imageUrl,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('🛑 createProduct error:', err);
    res.status(500).json({ message: 'Error creating product' });
  }
}

// Get distinct categories
export async function getCategories(req, res) {
  try {
    const cats = await Product.distinct('category');
    res.json(cats);
  } catch (err) {
    console.error('🛑 getCategories error:', err);
    res.status(500).json({ message: 'Error retrieving categories' });
  }
}

// Get distinct sizes
export async function getSizes(req, res) {
  try {
    const allSizes = await Product.distinct('sizes');
    res.json(allSizes);
  } catch (err) {
    console.error('🛑 getSizes error:', err);
    res.status(500).json({ message: 'Error retrieving sizes' });
  }
}

// Get distinct colors
export async function getColors(req, res) {
  try {
    const allColors = await Product.distinct('colors');
    res.json(allColors);
  } catch (err) {
    console.error('🛑 getColors error:', err);
    res.status(500).json({ message: 'Error retrieving colors' });
  }
}

// Get products with optional filtering
export async function getProducts(req, res) {
  try {
    const { category, sizes, colors, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (sizes) {
      filter.sizes = { $in: sizes.split(',') };
    }
    if (colors) {
      filter.colors = { $in: colors.split(',') };
    }

    // Price filtering
    const priceFilter = {};
    if (minPrice && !isNaN(minPrice)) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(maxPrice)) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length) {
      filter.price = priceFilter;
    }

    const prods = await Product.find(filter);
    res.json(prods);
  } catch (err) {
    console.error('🛑 getProducts error:', err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}
