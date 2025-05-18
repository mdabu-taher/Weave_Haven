// backend/src/controllers/adminController.js

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order   from '../models/Order.js';
import User    from '../models/User.js';

/**
 * GET /api/admin/stats
 */
export async function getStats(req, res) {
  try {
    const [productCount, orderCount, userCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ]);

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: 'Confirmed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } },
      { $project: { _id: 0, date: '$_id', total: 1 } }
    ]);

    return res.json({ productCount, orderCount, userCount, salesData });
  } catch (err) {
    console.error('Error fetching stats:', err);
    return res.status(500).json({ message: 'Server error retrieving stats' });
  }
}

/**
 * GET /api/admin/reports/top-products
 */
export async function getTopProducts(req, res) {
  try {
    const top = await Order.aggregate([
      { $match: { status: 'Confirmed' } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.qty' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id:       0,
          productId: '$_id',
          name:      '$product.name',
          totalSold: 1,
          price:     '$product.price'
        }
      }
    ]);
    return res.json(top);
  } catch (err) {
    console.error('Error fetching top products:', err);
    return res.status(500).json({ message: 'Server error retrieving top products' });
  }
}

/**
 * GET /api/admin/products
 */
export async function listProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error('Error listing products:', err);
    return res.status(500).json({ message: 'Server error retrieving products' });
  }
}

/**
 * POST /api/admin/products
 */
export async function createProduct(req, res) {
  try {
    // 1) extract the form fields, including salePrice
    const {
      name,
      description = '',
      category,
      subCategory = '',
      material    = '',
      price,
      salePrice   = null,
      countInStock = 0,
      sizes: sizesJson = '[]',
      colors: colorsJson = '[]'
    } = req.body;

    // 2) parse JSON-encoded arrays
    const sizes  = JSON.parse(sizesJson);
    const colors = JSON.parse(colorsJson);

    // 3) build file URLs from multer
    const photos = (req.files || []).map(f => `/uploads/${f.filename}`);

    // 4) assemble and save
    const product = new Product({
      name,
      description,
      category,
      subCategory,
      material,
      price:       Number(price),
      salePrice:   salePrice != null ? Number(salePrice) : null,
      // onSale will auto-sync via Product.pre('save') hook
      countInStock: Number(countInStock),
      sizes,
      colors,
      photos
    });

    const created = await product.save();
    return res.status(201).json({ message: 'Product created', product: created });
  } catch (err) {
    console.error('Error creating product:', err);
    return res
      .status(500)
      .json({ message: 'Server error creating product', error: err.message });
  }
}

/**
 * PUT /api/admin/products/:id
 */
export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // update allowed fields
    const {
      name,
      description,
      category,
      subCategory,
      material,
      price,
      salePrice,
      countInStock,
      sizes: sizesJson,
      colors: colorsJson,
      isActive
    } = req.body;

    if (name !== undefined)         product.name         = name;
    if (description !== undefined)  product.description  = description;
    if (category !== undefined)     product.category     = category;
    if (subCategory !== undefined)  product.subCategory  = subCategory;
    if (material !== undefined)     product.material     = material;
    if (price !== undefined)        product.price        = Number(price);
    if (salePrice !== undefined)    product.salePrice    = salePrice != null ? Number(salePrice) : null;
    if (countInStock !== undefined) product.countInStock = Number(countInStock);
    if (sizesJson !== undefined)    product.sizes        = JSON.parse(sizesJson);
    if (colorsJson !== undefined)   product.colors       = JSON.parse(colorsJson);
    if (isActive !== undefined)     product.isActive     = Boolean(isActive);

    // replace photos if new files were uploaded
    if (req.files && req.files.length) {
      product.photos = req.files.map(f => `/uploads/${f.filename}`);
    }

    const updated = await product.save();
    return res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ message: 'Server error updating product' });
  }
}

/**
 * DELETE /api/admin/products/:id
 */
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.remove();
    return res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ message: 'Server error deleting product' });
  }
}

/**
 * GET /api/admin/orders
 */
export async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email');
    return res.json(orders);
  } catch (err) {
    console.error('Error listing orders:', err);
    return res.status(500).json({ message: 'Server error retrieving orders' });
  }
}

/**
 * PUT /api/admin/orders/:id/status
 */
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    const updated = await order.save();
    return res.json(updated);
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ message: 'Server error updating order' });
  }
}

/**
 * GET /api/admin/users
 */
export async function getUsers(req, res) {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    return res.status(500).json({ message: 'Server error retrieving users' });
  }
}

/**
 * DELETE /api/admin/users/:id
 */
// src/controllers/adminController.js

// Delete a product
export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const removed = await Product.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(204).end();
  } catch (err) {
    console.error(`Error deleting product ${id}:`, err);
    return res.status(500).json({
      message: 'Server error deleting product',
      detail: err.message
    });
  }
}

/**
 * PUT /api/admin/users/:id/role
 */
export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    return res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error('Error updating user role:', err);
    return res.status(500).json({ message: 'Server error updating user role' });
  }
}
