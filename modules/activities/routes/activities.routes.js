const express = require('express');
const router = express.Router();
const activityModel = require('../models/activities.model');
const { validateActivity, handleValidationErrors } = require('../middlewares/activities.middleware');

// GET /activities - Get all activities
router.get('/', (req, res) => {
  try {
    const activities = activityModel.getAllActivities();
    res.status(200).json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
});

// GET /activities/:id - Get activity by ID
router.get('/:id', (req, res) => {
  try {
    const activity = activityModel.getActivityById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: error.message
    });
  }
});

// POST /activities - Create new activity
router.post('/', validateActivity, handleValidationErrors, (req, res) => {
  try {
    const newActivity = activityModel.addNewActivity(req.body);
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: newActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error.message
    });
  }
});

// PUT /activities/:id - Update activity
router.put('/:id', validateActivity, handleValidationErrors, (req, res) => {
  try {
    const updatedActivity = activityModel.updateExistingActivity(req.params.id, req.body);
    if (!updatedActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: updatedActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message
    });
  }
});

// DELETE /activities/:id - Delete activity
router.delete('/:id', (req, res) => {
  try {
    const deleted = activityModel.deleteActivity(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
      error: error.message
    });
  }
});

module.exports = router;
