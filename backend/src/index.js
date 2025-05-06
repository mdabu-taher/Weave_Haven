// backend/src/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import feedbackRoutes from './routes/feedback.js';
import authRoutes    from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes   from './routes/order.js';
import adminRoutes   from './routes/admin.js';

dotenv.config();

const app = express();

// 1) CORS: allow your frontend origin + cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // e.g. http://localhost:3000
    credentials: true
  })
);

// 2) Body parser & cookie parser
app.use(express.json());
app.use(cookieParser());

// 3) ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 4) Expose uploads directory
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// 5) Mount API routers
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);   // ← here we mount orderRoutes
app.use('/api/admin',    adminRoutes);   // adminRoutes applies its own protect/authorize
app.use('/api/feedback', feedbackRoutes);

// 6) MongoDB connection & server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
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
