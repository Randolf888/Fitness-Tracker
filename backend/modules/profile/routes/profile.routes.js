const express = require('express');
const {
  getProfileByUserId,
  createProfile,
  upsertProfile,
  deleteProfile
} = require('../models/profile.model');
const { authenticate, authorize } = require('../../../middlewares/authMiddleware');

const router = express.Router();
const canAccess = (req, resourceUserId) => {
  const ownerId = resourceUserId?._id ? resourceUserId._id.toString() : resourceUserId?.toString();
  return req.user.role === 'admin' || ownerId === req.user.id;
};

router.use(authenticate);
router.use(authorize('admin', 'customer'));

// GET user profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.params.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    if (!canAccess(req, profile.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view this profile' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create profile
router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.role === 'admin' ? (req.body.userId || req.user.id) : req.user.id
    };

    const profile = await createProfile(payload);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update profile (upsert to keep previous behavior)
router.put('/:userId', async (req, res) => {
  try {
    if (!canAccess(req, req.params.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update this profile' });
    }

    const payload = { ...req.body };
    if (req.user.role !== 'admin') {
      payload.userId = req.user.id;
    }

    const profile = await upsertProfile(req.params.userId, payload);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE profile
router.delete('/:userId', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot delete this profile' });
    }

    const profile = await deleteProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
