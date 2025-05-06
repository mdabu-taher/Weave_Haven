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
      paymentResult
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Enrich each item with product details
    const detailedItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        return {
          product: product._id,
          name:    product.name,
          image:   product.image,
          qty:     item.qty,
          price:   item.price
        };
      })
    );

    const order = new Order({
      user:             req.user.id,        // set by auth middleware
      orderItems:       detailedItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paidAt:           new Date(),
      status:           'Confirmed'
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ message: err.message || 'Server error creating order' });
  }
}

/**
 * Get all orders for the logged in user
 * GET /api/orders
 */
export async function getOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name image price');
    return res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
}

/**
 * Update order status (admin only)
 * PUT /api/orders/:id/status
 */
export async function updateOrderStatus(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Shipping', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    return res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ message: 'Server error updating order' });
  }
}
