import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas cluster
 */
const connectDB = async () => {
  try {
    // Reuse existing database connection in serverless warm containers
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
      console.warn('[DATABASE WARNING] MONGO_URI is not set. Continuing in offline/mock mode.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    console.log(` MongoDB Connected`);
    return conn;
  } catch (error) {
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB: ${error.message}`);
    // If running in local standalone production without live Atlas URI yet, exit; on Vercel let lambdas handle gracefully
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      process.exit(1);
    } else {
      console.warn('[DATABASE WARNING] Continuing in offline/mock mode until MONGO_URI is configured.');
    }
  }
};

export default connectDB;
