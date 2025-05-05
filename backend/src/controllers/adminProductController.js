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
  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
}

// Delete a product
export async function deleteProduct(req, res) {
  const { id } = req.params;
  const removed = await Product.findByIdAndDelete(id);
  if (!removed) return res.status(404).json({ message: 'Product not found' });
  res.status(204).end();
}
