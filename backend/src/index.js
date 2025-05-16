// backend/src/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
//feedback
import feedbackRoutes from './routes/feedback.js';
import authRoutes     from './routes/auth.js';
import productRoutes  from './routes/product.js';
import orderRoutes    from './routes/order.js';
import adminRoutes    from './routes/admin.js';

dotenv.config();

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Allow only your frontend origin and enable cookies
app.use(cors({
  origin: 'https://weave-haven-m4qd.vercel.app', // ← your deployed React URL
  credentials: true,
}));

// Manually handle OPTIONS preflight (so cookies & headers are allowed)
app.options('*', (req, res) => {
  res
    .header('Access-Control-Allow-Origin', 'https://weave-haven-m4qd.vercel.app')
    .header('Access-Control-Allow-Credentials', 'true')
    .header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    .header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    .sendStatus(200);
});

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());

// ─── STATIC FILES ──────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/feedback',  feedbackRoutes);

// ─── START SERVER ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
