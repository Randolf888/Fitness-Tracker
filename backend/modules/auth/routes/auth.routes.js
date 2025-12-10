const express = require('express');
const bcrypt = require('bcryptjs');
const { randomNumberOfNDigits } = require('../../../shared/compute-utils');
const { sendEmail } = require('../../../shared/email-utils');
const { encodeToken } = require('../../../shared/jwt-utils');
const {
  listUsers,
  getUserStats,
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser
} = require('../models/auth.model');
const { saveOTP, findOTPByEmail, deleteOTPById } = require('../models/otp.model');
const { authenticate, authorize } = require('../../../middlewares/authMiddleware');
const { Activity } = require('../../activities/models/activities.model');

const router = express.Router();

// POST register
router.post('/register', async (req, res) => {
  try {
    const user = await createUser({
      ...req.body,
      role: 'customer'
    });
    res.status(201).json({
      success: true,
      data: user,
      message: 'Registration successful. Please login to request an OTP.'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST login -> sends OTP to email
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await findUserByEmail(email, { includePassword: true });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let isMatch = false;
    const isLegacyPassword = user.password && !user.password.startsWith('$2');

    if (isLegacyPassword) {
      isMatch = user.password === password;
      if (isMatch) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    } else {
      isMatch = await user.comparePassword(password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const otp = randomNumberOfNDigits(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await saveOTP(email, otp, expiresAt);
    await sendEmail(
      email,
      'Your FitLog Pro login code',
      `Your one-time password is ${otp}. It expires in 10 minutes. If you did not request this code, please ignore this email.`
    );

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to continue.'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST verify-login -> verifies OTP and returns JWT
router.post('/verify-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const submittedOtp = String(otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.'
      });
    }

    const otpRecord = await findOTPByEmail(email);

    if (!otpRecord || otpRecord.code !== submittedOtp) {
      return res.status(401).json({ success: false, message: 'OTP verification failed' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await deleteOTPById(otpRecord._id);
      return res.status(401).json({ success: false, message: 'OTP has expired' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await deleteOTPById(otpRecord._id);

    const role = user.role || 'customer';

    const token = encodeToken({
      sub: user._id.toString(),
      role,
      email: user.email
    });

    res.status(200).json({
      success: true,
      token,
      data: { ...user.toJSON(), role }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protect the remaining user routes
router.use(authenticate);
router.use(authorize('admin', 'customer'));

// Admin-only: list users with search and pagination
router.get('/users', authorize('admin'), async (req, res) => {
  try {
    const { search, role, page, limit, sortBy, sortOrder } = req.query;
    const result = await listUsers({ search, role, page, limit, sortBy, sortOrder });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin-only: basic system stats for dashboards
router.get('/stats', authorize('admin'), async (req, res) => {
  try {
    const [userStats, totalActivities] = await Promise.all([
      getUserStats(),
      Activity.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...userStats,
        totalActivities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view other users' });
    }

    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update other users' });
    }

    const payload = { ...req.body };

    // Prevent customers from escalating privileges
    if (req.user.role !== 'admin') {
      payload.role = 'customer';
    }

    const user = await updateUser(req.params.id, payload);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete users' });
    }

    const user = await deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
