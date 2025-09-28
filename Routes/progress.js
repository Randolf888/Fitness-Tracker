const express = require('express');
const router = express.Router();

// GET /progress - get progress tracking data
router.get('/', (req, res) => {
  res.json({
    message: 'Progress tracking data',
    progress: {
      weeklySteps: 50000,
      monthlyCalories: 15000,
      charts: ['stepChart.png', 'calorieChart.png'],
      analytics: {
        averageDailySteps: 7143,
        totalWorkouts: 12,
        goalAchievementRate: 85
      }
    }
  });
});

module.exports = router;
