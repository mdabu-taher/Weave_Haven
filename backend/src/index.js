// backend/src/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import feedbackRoutes from './routes/feedback.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// ✅ Proper CORS configuration — must come before other middlewares
app.use(cors({
  origin: 'https://weave-haven-m4qd.vercel.app', // your frontend Vercel domain
  credentials: true
}));

// ✅ Parse cookies and JSON in the correct order
app.use(cookieParser());
app.use(express.json());

// ✅ Setup __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
