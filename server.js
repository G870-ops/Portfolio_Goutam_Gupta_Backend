import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';

import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

connectDB().catch((err) => {
  console.warn('[SERVER INIT] DB connection deferred:', err.message);
});

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    if (req.path === '/' || req.path === '/api/health') {
      return next();
    }
    return res.status(503).json({
      success: false,
      message: 'Database connection failed or timed out. Please check network/IP whitelist in MongoDB Atlas.',
      error: err.message,
    });
  }
});

app.use(helmet());


const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, '') : null;
const allowedOrigins = [
  clientUrl,
  'https://portfolio-goutam-gupta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  /^https:\/\/.*\.vercel\.app$/,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((allowed) =>
        typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    system: 'MAKAUT_NODE.04',
    architecture: 'MERN Full-Stack v4.0',
    message: 'Goutam Gupta Portfolio Backend Microservice is active and operational.',
    healthEndpoint: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'MAKAUT_NODE.04',
    architecture: 'MERN Full-Stack v4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

process.on('unhandledRejection', (err) => {
  console.error(`[UNHANDLED REJECTION] ${err.message}`);
});

export default app;