// backend/src/controllers/adminController.js

import Product from '../models/Product.js';

/**
 * Admin: Create a new product
 * POST /api/admin/products
 */
export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      images,
      category,
      sizes,
      colors,
      price,
      countInStock
    } = req.body;

    const product = new Product({
      name,
      description,
      images,
      category,
      sizes,
      colors,
      price,
      countInStock
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating product' });
  }
}

/**
 * Admin: Update an existing product
 * PUT /api/admin/products/:id
 */
export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update fields
    Object.assign(product, req.body);

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating product' });
  }
}

/**
 * Admin: Delete a product
 * DELETE /api/admin/products/:id
 */
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting product' });
  }
}
