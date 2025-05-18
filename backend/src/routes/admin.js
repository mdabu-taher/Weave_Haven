import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

import {
  getStats,
  getTopProducts,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getUsers,
  deleteUser,
  updateUserRole
} from '../controllers/adminController.js';

const router = express.Router();

// All /api/admin/** routes require an authenticated admin user
router.use(isAdmin);

// Dashboard Stats
router.get('/stats', getStats);

// Top-products report
router.get('/reports/top-products', getTopProducts);

// Order management
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User management
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Product CRUD
router.route('/products')
  .get(listProducts)
  // ← Multer will parse up to 5 files under fieldname="photos"
  .post(upload.array('photos', 5), createProduct);
router.get('/products/:id',    getProduct); 
router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
