import Feedback from '../models/Feedback.js';
import Order from '../models/Order.js';

/**
 * POST /api/feedback
 * Body: { orderId, productId, rating, comment }
 */
export async function createFeedback(req, res, next) {
  try {
    const { orderId, productId, rating, comment } = req.body;

    // 1) Verify order and ownership
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Cannot leave feedback for this order.' });
    }
    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'You can only review delivered orders.' });
    }

    // 2) Verify product in order
    const purchased = order.orderItems.some(item => item.product.toString() === productId);
    if (!purchased) {
      return res.status(400).json({ message: 'Product not found in this order.' });
    }

    // 3) Create feedback
    const feedback = new Feedback({
      user: req.user.id,
      order: orderId,
      product: productId,
      rating,
      comment
    });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You’ve already reviewed this product.' });
    }
    next(err);
  }
}

/**
 * GET /api/feedback/product/:productId
 */
export async function getProductFeedback(req, res, next) {
  try {
    const feedbacks = await Feedback.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    next(err);
  }
}
