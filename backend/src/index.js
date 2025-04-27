import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/product.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// built-in middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,  // allow frontend (React) access
  credentials: true                  // allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// read port from .env or default to 5000
const PORT = process.env.PORT || 5000;

// connect to MongoDB, then start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => console.error('❌ Mongo connection error:', err));
