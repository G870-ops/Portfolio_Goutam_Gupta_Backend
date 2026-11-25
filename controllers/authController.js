import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id, role = 'admin') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_matrix', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

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

    const matchesEnvUser =
      usernameOrEmail.toLowerCase() === envEmail ||
      usernameOrEmail.toLowerCase() === envUser.toLowerCase();
    const matchesEnvPass = password === envPass;

    if (matchesEnvUser && matchesEnvPass) {
      let adminId = '000000000000000000000001';

      try {
        const persistedUser = await User.create({
          username: envUser,
          email: envEmail,
          password: envPass,
          role: 'admin',
        });
        adminId = persistedUser._id;
      } catch (saveError) {
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

    let user = null;
    if (req.user && req.user._id && req.user._id !== '000000000000000000000001') {
      user = await User.findById(req.user._id).select('+password');
    }

    if (!user) {
      user = await User.findOne({
        $or: [
          { email: envEmail },
          { username: envUser },
        ],
      }).select('+password');
    }

    if (user) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password. Verification failed.',
        });
      }

      user.password = newPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Admin password successfully updated in MongoDB database!',
      });
    }

    if (currentPassword !== envPass) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password. Verification failed.',
      });
    }

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

