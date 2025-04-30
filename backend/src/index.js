import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';

dotenv.config();

const app = express();

// 1) CORS: allow frontend origin + cookies
app.use(cors({
  origin: process.env.FRONTEND_URL,  // e.g. http://localhost:3000
  credentials: true
}));

// 2) Body & cookie parsers
app.use(express.json());
app.use(cookieParser());

// 3) Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 4) Serve uploads folder at /uploads
//    => http://localhost:5000/uploads/yourfile.ext
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 5) Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 6) Connect to Mongo & start server
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
