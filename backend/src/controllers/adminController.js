// backend/src/controllers/adminController.js

import Product from '../models/Product.js';
import Order   from '../models/Order.js';
import User    from '../models/User.js';

/**
 * Admin: Dashboard stats
 * GET /api/admin/stats
 */
export async function getStats(req, res) {
  try {
    // Counts
    const [productCount, orderCount, userCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ]);

    // Sales over last 30 days
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ productCount, orderCount, userCount, salesData });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error retrieving stats' });
  }
}

/**
 * Admin: Top 5 selling products report
 * GET /api/admin/reports/top-products
 */
export async function getTopProducts(req, res) {
  try {
    const top = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' }
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

    res.json(top);
  } catch (err) {
    console.error('Error fetching top products:', err);
    res.status(500).json({ message: 'Server error retrieving top products' });
  }
}

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

/**
 * Admin: List all orders
 * GET /api/admin/orders
 */
export async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email');
    res.json(orders);
  } catch (err) {
    console.error('Error listing orders:', err);
    res.status(500).json({ message: 'Server error retrieving orders' });
  }
}

/**
 * Admin: Update order status
 * PUT /api/admin/orders/:id/status
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
    res.json(updated);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error updating order' });
  }
}

/**
 * Admin: List all users
 * GET /api/admin/users
 */
export async function getUsers(req, res) {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
}

/**
 * Admin: Delete a user
 * DELETE /api/admin/users/:id
 */
export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error deleting user' });
  }
}

/**
 * Admin: Update a user's role
 * PUT /api/admin/users/:id/role
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
    res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error updating user role' });
  }
}
