// backend/src/routes/auth.js
import express from 'express';
import { getMe, login, signup } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', getMe);
router.post('/login', login);
router.post('/signup', signup);

export default router;
