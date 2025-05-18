// server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes     from './routes/auth.js';
import productRoutes  from './routes/product.js';
import orderRoutes    from './routes/order.js';
import adminRoutes    from './routes/admin.js';
import feedbackRoutes from './routes/feedback.js';

dotenv.config();
const app = express();

// ───────── CORS ─────────
const allowedOrigins = [
  'https://weave-haven-m4qd.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ───────── MIDDLEWARE ─────────
app.use(cookieParser());
app.use(express.json());

// ───────── STATIC FILES ─────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ───────── ROUTES ─────────
app.use('/api/auth',     authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/feedback',  feedbackRoutes);

// ───────── ERROR HANDLER ─────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Unexpected server error' });
});

// ───────── START SERVER ─────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server listening on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });
