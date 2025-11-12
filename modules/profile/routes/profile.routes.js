const express = require('express');
const profileModel = require('../models/profile.model');

const router = express.Router();

// GET user profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await profileModel.findOne({ userId: req.params.userId });
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
    const profile = await profileModel.create(req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update profile
router.put('/:userId', async (req, res) => {
  try {
    const profile = await profileModel.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE profile
router.delete('/:userId', async (req, res) => {
  try {
    const profile = await profileModel.findOneAndDelete({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
