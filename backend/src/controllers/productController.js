// backend/src/controllers/productController.js

import Product from '../models/Product.js';

/**
 * Create a new product
 * POST /api/products
 */
export async function createProduct(req, res) {
  try {
    // Pull salePrice in addition to your existing fields
    const { name, price, description, category, sizes, colors, material, salePrice } = req.body;

    // Handle optional photo upload
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const photos = imageUrl ? [imageUrl] : [];

    // Only mark onSale if salePrice is provided and less than the regular price
    const onSale =
      salePrice != null &&
      salePrice !== '' &&
      !isNaN(salePrice) &&
      Number(salePrice) < Number(price);

    // Create the product document
    const product = await Product.create({
      name:        name.trim(),
      description: (description || '').trim(),
      price:       Number(price),
      // New sale-related fields:
      salePrice:   onSale ? Number(salePrice) : null,
      onSale,
      category:    category.trim(),
      sizes:       sizes ? sizes.split(',').map(s => s.trim()) : [],
      colors:      colors ? colors.split(',').map(c => c.trim()) : [],
      material:    (material || '').trim(),
      photos
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error('🛑 createProduct error:', err);
    return res.status(500).json({ message: 'Error creating product' });
  }
}

/**
 * Get distinct categories
 * GET /api/products/categories
 */
export async function getCategories(req, res) {
  try {
    const cats = await Product.distinct('category');
    return res.json(cats);
  } catch (err) {
    console.error('🛑 getCategories error:', err);
    return res.status(500).json({ message: 'Error retrieving categories' });
  }
}

/**
 * Get distinct sizes
 * GET /api/products/sizes
 */
export async function getSizes(req, res) {
  try {
    const allSizes = await Product.distinct('sizes');
    return res.json(allSizes);
  } catch (err) {
    console.error('🛑 getSizes error:', err);
    return res.status(500).json({ message: 'Error retrieving sizes' });
  }
}

/**
 * Get distinct colors
 * GET /api/products/colors
 */
export async function getColors(req, res) {
  try {
    const allColors = await Product.distinct('colors');
    return res.json(allColors);
  } catch (err) {
    console.error('🛑 getColors error:', err);
    return res.status(500).json({ message: 'Error retrieving colors' });
  }
}

/**
 * List products (with optional filtering)
 * GET /api/products
 * Query params: category, sizes (csv), colors (csv), minPrice, maxPrice
 */
export async function getProducts(req, res) {
  try {
    const { category, sizes, colors, minPrice, maxPrice, new: isNew } = req.query;
    const filter = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Sizes filter
    if (sizes) {
      filter.sizes = { $in: sizes.split(',') };
    }

    // Colors filter
    if (colors) {
      filter.colors = { $in: colors.split(',') };
    }

    // Price range filter
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

    // If `/api/products?new=true`, only show items created within last 14 days
    if (isNew === 'true') {
      const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: cutoff };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error('🛑 getProducts error:', err);
    return res.status(500).json({ message: 'Error retrieving products' });
  }
}

/**
 * Get a single product by ID
 * GET /api/products/:id
 */
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    console.error('🛑 getProductById error:', err);
    return res.status(500).json({ message: 'Error retrieving product' });
  }
}
