import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order   from '../models/Order.js';
import User    from '../models/User.js';

/**
 * GET /api/admin/stats
 * Returns total counts and sales over last 30 days (Confirmed orders only)
 */
export async function getStats(req, res) {
  try {
    // 1. Total counts
    const [productCount, orderCount, userCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ]);

    // 2. Sales over last 30 days (Confirmed orders only)
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
 * Returns top 5 selling products (Confirmed orders only)
 */
export async function getTopProducts(req, res) {
  try {
    const top = await Order.aggregate([
      // Only Confirmed orders
      { $match: { status: 'Confirmed' } },
      // Unwind the orderItems array
      { $unwind: '$orderItems' },
      // Group by product ID, summing the qty
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.qty' }
        }
      },
      // Sort descending by quantity sold
      { $sort: { totalSold: -1 } },
      // Take top 5
      { $limit: 5 },
      // Lookup product details
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      // Project only the fields we need
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
 * List all products
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
 * Create a new product
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
    return res.status(201).json(created);
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ message: 'Server error creating product' });
  }
}

/**
 * PUT /api/admin/products/:id
 * Update an existing product
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
    return res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ message: 'Server error updating product' });
  }
}

/**
 * DELETE /api/admin/products/:id
 * Delete a product
 */
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    return res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ message: 'Server error deleting product' });
  }
}

/**
 * GET /api/admin/orders
 * List all orders
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
 * Update order status
 */
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
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
 * List all users
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
 * Delete a user
 */
export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ message: 'Server error deleting user' });
  }
}

/**
 * PUT /api/admin/users/:id/role
 * Update a user's role
 */
export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();
    return res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error('Error updating user role:', err);
    return res.status(500).json({ message: 'Server error updating user role' });
  }
}
