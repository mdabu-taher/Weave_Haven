// backend/src/routes/product.js
import express from 'express';
import multer from 'multer';
import {
  createProduct,
  getCategories,
  getSizes,
  getColors,
  getProducts,
} from '../controllers/productController.js';

const router = express.Router();

// configure multer to write into your uploads/ folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ————— CRUD routes —————
// 1) create a new product (with image upload)
router.post('/', upload.single('image'), createProduct);

// 2) read filters
router.get('/categories', getCategories);
router.get('/sizes',      getSizes);
router.get('/colors',     getColors);

// 3) read product list
router.get('/',           getProducts);

export default router;
