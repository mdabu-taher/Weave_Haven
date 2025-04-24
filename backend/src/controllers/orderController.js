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
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Optionally check stock levels
    for (let item of orderItems) {
      const prod = await Product.findById(item.product);
      if (prod.countInStock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${prod.name}` });
      }
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err);
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
