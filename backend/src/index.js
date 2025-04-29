import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js'; // your existing product routes

dotenv.config();

const app = express();

// Allow frontend to reach us, including cookies
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Parse JSON bodies & cookies
app.use(express.json());
app.use(cookieParser());

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount our routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Start up!
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => console.error('❌ Mongo connection error:', err));
