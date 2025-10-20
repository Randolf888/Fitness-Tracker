const express = require('express');
const router = express.Router();
const dashboardModel = require('../models/dashboard.model');
const { validateDashboardRequest } = require('../middlewares/dashboard.middleware');

// GET /dashboard
router.get('/', validateDashboardRequest, (req, res) => {
  try {
    const dashboardData = dashboardModel.getDashboardData();
    
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

module.exports = router;
