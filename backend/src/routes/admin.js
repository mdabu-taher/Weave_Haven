import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminController.js';

const router = express.Router();

// Only admins can manage all products
router.use(protect, authorize('admin'));

router.post('/products',       createProduct);
router.put('/products/:id',    updateProduct);
router.delete('/products/:id', deleteProduct);

// Example: change user roles (admin only)
import User from '../models/User.js';
router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['user','seller','admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json({ message: `Role updated to ${role}` });
});

export default router;
