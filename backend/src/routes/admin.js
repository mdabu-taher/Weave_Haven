import express from 'express';
import { isAdmin } from '../middleware/auth.js';

import {
  getStats,
  getTopProducts,
  listProducts,
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

/**
 * Dashboard Stats
 * GET /api/admin/stats
 */
router.get('/stats', getStats);

/**
 * Basic Reports
 * GET /api/admin/reports/top-products
 */
router.get('/reports/top-products', getTopProducts);

/**
 * Order Management
 * GET    /api/admin/orders
 * PUT    /api/admin/orders/:id/status
 */
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

/**
 * User Management
 * GET    /api/admin/users
 * DELETE /api/admin/users/:id
 * PUT    /api/admin/users/:id/role
 */
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

/**
 * Product CRUD
 * GET    /api/admin/products
 * POST   /api/admin/products
 * PUT    /api/admin/products/:id
 * DELETE /api/admin/products/:id
 */
router
  .route('/products')
  .get(listProducts)
  .post(createProduct);

router
  .route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
