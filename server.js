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
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize MongoDB Atlas connection
connectDB().catch((err) => {
  console.warn('[SERVER INIT] Initial DB connection deferred:', err.message);
});

const app = express();

// Ensure DB is connected before processing requests (critical for serverless / Vercel cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    // If route doesn't require DB (e.g. /api/health or root status), continue
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

// Security HTTP headers
app.use(helmet());


// Cross-Origin Resource Sharing (CORS) Configuration
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, '') : null;
const allowedOrigins = [
  clientUrl,
  'https://portfolio-goutam-gupta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  // Vercel production & preview deployments
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  /^https:\/\/.*\.vercel\.app$/,  // allow all *.vercel.app preview URLs
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Check string exact-match OR regex match (for *.vercel.app wildcard)
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

// Request body parsers with payload size limit
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));

// Development request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root Status Route (Displays when visiting backend URL directly)
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

// System Telemetry & Health Check API
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

// Mount Core Application Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// In Vercel serverless functions, the Express app is exported directly and handled by @vercel/node.
// app.listen is only required for local dev or traditional VPS/container hosting.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[UNHANDLED REJECTION] ${err.message}`);
  // In production, server.close(() => process.exit(1));
});

export default app;