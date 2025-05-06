// backend/src/routes/orders.js

import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// 1) Protect all /api/orders routes—must be logged in
router.use(protect);

// 2) Place an order & view your own orders (any authenticated user)
router.route('/')
  .get(authorize('user', 'seller', 'admin'), getOrders)
  .post(authorize('user', 'seller', 'admin'), createOrder);

// 3) Admin only: update any order's status
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
