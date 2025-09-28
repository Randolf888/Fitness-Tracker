const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'User profile',
    profile: {
      name: 'Demo User',
      email: 'user@example.com',
      goals: {
        dailySteps: 10000,
        dailyCalories: 250
      }
    }
  });
});

// PUT /profile - update user profile
router.put('/', (req, res) => {
  // Dummy update logic
  const updatedProfile = { ...req.body };
  res.json({
    message: 'Profile updated',
    profile: updatedProfile
  });
});

module.exports = router;