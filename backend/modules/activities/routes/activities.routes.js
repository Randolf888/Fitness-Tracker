const express = require('express');
const {
  getAllActivities,
  getActivityById,
  addNewActivity,
  updateExistingActivity,
  deleteActivity
} = require('../models/activities.model');

const router = express.Router();

// GET all activities with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { activities, total, page, pages, limit } = await getAllActivities(req.query);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: { total, page, pages, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET activity by ID
router.get('/:id', async (req, res) => {
  try {
    const activity = await getActivityById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create activity
router.post('/', async (req, res) => {
  try {
    const activity = await addNewActivity(req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update activity
router.put('/:id', async (req, res) => {
  try {
    const activity = await updateExistingActivity(req.params.id, req.body);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await deleteActivity(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
