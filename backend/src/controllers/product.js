import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProducts,
  getProductById,
  createProduct
} from '../controllers/productController.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.resolve('uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct);

export default router;
