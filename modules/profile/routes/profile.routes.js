const express = require('express');
const router = express.Router();
const profileModel = require('../models/profile.model');
const { validateProfileUpdate, handleValidationErrors } = require('../middlewares/profile.middleware');

// GET /profile
router.get('/', (req, res) => {
  try {
    const profile = profileModel.getUserProfile();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// PUT /profile
router.put('/', validateProfileUpdate, handleValidationErrors, (req, res) => {
  try {
    const updatedProfile = profileModel.updateUserProfile(1, req.body);

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedProfile.id,
        username: updatedProfile.username,
        email: updatedProfile.email,
        profile: updatedProfile.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

module.exports = router;
