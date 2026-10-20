import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate signed JWT Token
 */
const generateToken = (id, role = 'admin') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_matrix', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @desc   Authenticate Admin and issue JWT
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username/email and password',
      });
    }

    const envUser = process.env.ADMIN_USERNAME || 'goutam';
    const envEmail = (process.env.ADMIN_EMAIL || 'goutamgupta605@gmail.com').toLowerCase();
    const envPass = process.env.ADMIN_PASSWORD || 'adminPassword123!';

    // Try finding user in database first
    let user = null;
    try {
      user = await User.findOne({
        $or: [
          { email: usernameOrEmail.toLowerCase() },
          { username: usernameOrEmail },
        ],
      }).select('+password');
    } catch (dbError) {
      console.warn('[AUTH] Database query offline or unseeded:', dbError.message);
    }

    // If user exists in DB, verify password hash
    if (user) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Access rejected.',
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        success: true,
        message: 'Authentication successful. Admin access granted.',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Fallback: If DB is empty, unseeded, or offline, authenticate against configured environment admin credentials
    const matchesEnvUser =
      usernameOrEmail.toLowerCase() === envEmail ||
      usernameOrEmail.toLowerCase() === envUser.toLowerCase();
    const matchesEnvPass = password === envPass;

    if (matchesEnvUser && matchesEnvPass) {
      let adminId = '000000000000000000000001';

      // If DB is reachable, attempt to persist the admin user so future queries find it
      try {
        const persistedUser = await User.create({
          username: envUser,
          email: envEmail,
          password: envPass,
          role: 'admin',
        });
        adminId = persistedUser._id;
      } catch (saveError) {
        // If DB not connected or already exists, continue with virtual session
      }

      const token = generateToken(adminId, 'admin');

      return res.status(200).json({
        success: true,
        message: 'Authentication successful. Admin access granted.',
        token,
        user: {
          id: adminId,
          username: envUser,
          email: envEmail,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Access rejected.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Verify current admin session
 * @route  GET /api/auth/me
 * @access Private/Admin
 */
export const getAdminProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Change admin password
 * @route  PUT /api/auth/change-password
 * @access Private/Admin
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters in length',
      });
    }

    const envUser = process.env.ADMIN_USERNAME || 'goutam';
    const envEmail = (process.env.ADMIN_EMAIL || 'goutamgupta605@gmail.com').toLowerCase();
    const envPass = process.env.ADMIN_PASSWORD || 'adminPassword123!';

    // Find the user in database
    let user = null;
    if (req.user && req.user._id && req.user._id !== '000000000000000000000001') {
      user = await User.findById(req.user._id).select('+password');
    }

    // If not found by ID, attempt lookup by email or username
    if (!user) {
      user = await User.findOne({
        $or: [
          { email: envEmail },
          { username: envUser },
        ],
      }).select('+password');
    }

    if (user) {
      // Validate current password against stored hash
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password. Verification failed.',
        });
      }

      // Update password (pre-save hook hashes it)
      user.password = newPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Admin password successfully updated in MongoDB database!',
      });
    }

    // Fallback: User not yet created in MongoDB database (was using env credentials)
    if (currentPassword !== envPass) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password. Verification failed.',
      });
    }

    // Persist new admin user in MongoDB with the new password
    await User.create({
      username: envUser,
      email: envEmail,
      password: newPassword,
      role: 'admin',
    });

    return res.status(200).json({
      success: true,
      message: 'Admin account provisioned and password updated successfully in MongoDB!',
    });
  } catch (error) {
    next(error);
  }
};

