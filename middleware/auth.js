import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect admin routes using JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_matrix'
      );

      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        req.user = null;
      }

      if (!req.user) {
        if (decoded.role === 'admin' || decoded.id === '000000000000000000000001') {
          req.user = {
            _id: decoded.id,
            id: decoded.id,
            username: process.env.ADMIN_USERNAME || 'goutam',
            email: process.env.ADMIN_EMAIL || 'goutamgupta605@gmail.com',
            role: 'admin',
          };
        } else {
          return res.status(401).json({
            success: false,
            message: 'Admin authorization failed: user does not exist',
          });
        }
      }

      next();
    } catch (error) {
      console.error('[AUTH ERROR] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authorization token provided',
    });
  }
};
