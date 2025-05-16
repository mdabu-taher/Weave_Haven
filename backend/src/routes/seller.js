import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  sellerAddProduct,
  sellerGetProducts
} from '../controllers/sellerController.js';

const router = express.Router();
router.use(protect, authorize('seller'));

router.post('/products',     sellerAddProduct);
router.get('/products',      sellerGetProducts);

export default router;
