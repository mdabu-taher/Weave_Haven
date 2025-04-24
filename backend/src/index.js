import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/product.js';
import authRoutes    from './routes/auth.js';

dotenv.config();

const app = express();

// built-in middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// resolve __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// === Serve uploaded images ===
// any file in <project-root>/backend/uploads/*
// will be available at http://localhost:5000/uploads/<filename>
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// === API routes ===
app.use('/api/products', productRoutes);
app.use('/api/auth',     authRoutes);

// === MongoDB + start server ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server listening on port 5000'));
  })
  .catch(err => console.error('❌ Mongo connection error:', err));
