// backend/src/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import feedbackRoutes from './routes/feedback.js';
import authRoutes     from './routes/auth.js';
import productRoutes  from './routes/product.js';
import orderRoutes    from './routes/order.js';
import adminRoutes    from './routes/admin.js';

dotenv.config();
const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Only allow your deployed front-end and localhost during dev
const allowedOrigins = [
  process.env.FRONTEND_URL,    // e.g. https://weave-haven-m4qd.vercel.app
  'http://localhost:3000'
];

// Log at startup to confirm your whitelist is picked up
console.log('🛡 CORS whitelist is:', allowedOrigins);

// Build a reusable options object
const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // allow requests with no origin (e.g. curl, mobile apps)
    if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
      return callback(null, true);
    }
    return callback(
      new Error(`CORS policy: origin "${incomingOrigin}" not allowed.`),
      false
    );
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
};

// 1) Handle CORS pre-flight for all routes
app.options('*', cors(corsOptions));

// 2) Apply CORS to every request
app.use(cors(corsOptions));

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());

// ─── STATIC FILES ──────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// ─── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/feedback',  feedbackRoutes);

// ─── START SERVER ──────────────────────────────────────────────────────────────
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
