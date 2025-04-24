import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  sellerAddProduct,
  sellerGetProducts
} from '../controllers/sellerController.js';

const router = express.Router();

// All routes here require a logged‑in user with role 'seller'
router.use(protect, authorize('seller'));

router.post('/products',     sellerAddProduct);
router.get('/products',      sellerGetProducts);

export default router;
