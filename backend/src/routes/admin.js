import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminController.js';
import User from '../models/User.js';

const router = express.Router();

// All routes below require an authenticated admin
router.use(isAdmin);

// ——— Product CRUD ———

// GET    /api/admin/products       → list all products
router.get('/products', listProducts);

// POST   /api/admin/products       → create a new product
router.post('/products', createProduct);

// PUT    /api/admin/products/:id   → update an existing product
router.put('/products/:id', updateProduct);

// DELETE /api/admin/products/:id   → delete a product
router.delete('/products/:id', deleteProduct);

// ——— User Role Management ———

// PUT    /api/admin/users/:id/role → update a user’s role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    res.json({ message: `Role updated to ${role}` });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error updating role' });
  }
});

export default router;
