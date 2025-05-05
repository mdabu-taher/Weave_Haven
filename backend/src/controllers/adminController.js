import Product from '../models/Product.js';

/**
 * Admin: List all products
 * GET /api/admin/products
 */
export async function listProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error listing products:', err);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
}

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
    console.error('Error creating product:', err);
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
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Assign only allowed fields
    const allowed = [
      'name',
      'description',
      'images',
      'category',
      'sizes',
      'colors',
      'price',
      'countInStock',
      'isActive'
    ];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
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
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error deleting product' });
  }
}
