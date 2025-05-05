import express from 'express';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminProductController.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();
router.use(isAdmin);

// GET    /api/admin/products
router.get('/', listProducts);

// POST   /api/admin/products
router.post('/', createProduct);

// PUT    /api/admin/products/:id
router.put('/:id', updateProduct);

// DELETE /api/admin/products/:id
router.delete('/:id', deleteProduct);

export default router;
