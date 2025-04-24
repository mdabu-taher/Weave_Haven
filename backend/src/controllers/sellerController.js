import Product from '../models/Product.js';

/**
 * Seller: create a product (only their own)
 * POST /api/seller/products
 */
export async function sellerAddProduct(req, res) {
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
      countInStock,
      seller: req.user._id   // assuming you added a `seller` field on Product
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating product' });
  }
}

/**
 * Seller: list only their own products
 * GET /api/seller/products
 */
export async function sellerGetProducts(req, res) {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
}
