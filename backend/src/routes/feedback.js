import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createFeedback,
  getProductFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

// Leave fdback
router.post('/', protect, createFeedback);

// List feedback for a products
router.get('/product/:productId', getProductFeedback);

export default router;
