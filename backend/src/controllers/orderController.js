// backend/src/controllers/orderController.js

import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Create a new order
 * POST /api/orders
 */
export async function createOrder(req, res) {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentResult // <- Optional from frontend mock (id, status, email, update_time)
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Optional: Validate stock if you're tracking it
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      // Uncomment if using inventory:
      // if (product.countInStock < item.qty) {
      //   return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      // }
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paidAt: new Date()
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Server error creating order' });
  }
}

/**
 * Get all orders for the logged in user
 * GET /api/orders
 */
export async function getOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
}

/**
 * Update order status (admin only)
 * PUT /api/orders/:id/status
 */
export async function updateOrderStatus(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status } = req.body;
    if (!['Confirmed', 'Shipping', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    if (status === 'Delivered') order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating order' });
  }
}
