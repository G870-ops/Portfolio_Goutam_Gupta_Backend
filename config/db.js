import mongoose from 'mongoose';

let cachedConnection = null;

/**
 * Connect to MongoDB Atlas cluster with cached connection promise
 * for serverless (Vercel) environments
 */
const connectDB = async () => {
  // If already connected, return existing connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // If connection is already in progress, await the cached promise
  if (cachedConnection) {
    return await cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    console.warn('[DATABASE WARNING] MONGO_URI is not set. Continuing in offline/mock mode.');
    return;
  }

  try {
    cachedConnection = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    const conn = await cachedConnection;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedConnection = null;
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      process.exit(1);
    } else {
      console.warn('[DATABASE WARNING] Continuing in offline/mock mode until MONGO_URI is configured.');
    }
    throw error;
  }
};

export default connectDB;

