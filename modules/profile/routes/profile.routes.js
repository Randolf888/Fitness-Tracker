const express = require('express');
const {
  getProfileByUserId,
  createProfile,
  upsertProfile,
  deleteProfile
} = require('../models/profile.model');

const router = express.Router();

// GET user profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.params.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create profile
router.post('/', async (req, res) => {
  try {
    const profile = await createProfile(req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update profile (upsert to keep previous behavior)
router.put('/:userId', async (req, res) => {
  try {
    const profile = await upsertProfile(req.params.userId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE profile
router.delete('/:userId', async (req, res) => {
  try {
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
