import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Any authenticated user (user, seller, or admin) can place and view their own orders
router.use(protect, authorize('user','seller','admin'));

router.post('/',            createOrder);
router.get('/',             getOrders);
router.put('/:id/status',   authorize('admin'), updateOrderStatus);

export default router;
