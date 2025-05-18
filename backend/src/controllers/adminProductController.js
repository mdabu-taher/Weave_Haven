import Product from '../models/Product.js';

// List all products
export async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

// Add a new product
export async function createProduct(req, res) {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
}

// Update an existing product
export async function updateProduct(req, res) {
  const { id } = req.params;
  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(updated);
  } catch (err) {
    console.error(`Error updating product ${id}:`, err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error updating product',
        detail: err.message
      });
    }
    return res.status(500).json({
      message: 'Server error updating product',
      detail: err.message
    });
  }
}

// Delete a product
export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const removed = await Product.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optional: cleanup related resources here, e.g. removeImages(removed.photos);

    return res.status(204).end();
  } catch (err) {
    console.error(`Error deleting product ${id}:`, err);
    return res.status(500).json({
      message: 'Server error deleting product',
      detail: err.message
    });
  }
}

