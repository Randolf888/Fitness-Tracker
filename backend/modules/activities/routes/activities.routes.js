const express = require('express');
const {
  getAllActivities,
  getActivityById,
  addNewActivity,
  updateExistingActivity,
  deleteActivity
} = require('../models/activities.model');
const { authenticate, authorize } = require('../../../middlewares/authMiddleware');

const router = express.Router();
const canAccess = (req, resourceUserId) => {
  const ownerId = resourceUserId?._id ? resourceUserId._id.toString() : resourceUserId?.toString();
  return req.user.role === 'admin' || ownerId === req.user.id;
};

router.use(authenticate);
router.use(authorize('admin', 'customer'));

// GET all activities with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const query = { ...req.query };

    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const { activities, total, page, pages, limit } = await getAllActivities(query);

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

    if (!canAccess(req, activity.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view this activity' });
    }

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create activity
router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.role === 'admin' ? (req.body.userId || req.user.id) : req.user.id
    };

    const activity = await addNewActivity(payload);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update activity
router.put('/:id', async (req, res) => {
  try {
    const existing = await getActivityById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update this activity' });
    }

    const payload = {
      ...req.body
    };

    if (req.user.role !== 'admin') {
      payload.userId = req.user.id;
    }

    const activity = await updateExistingActivity(req.params.id, payload);


    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE activity
router.delete('/:id', async (req, res) => {
  try {
    const existing = await getActivityById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot delete this activity' });
    }

    const activity = await deleteActivity(req.params.id);


    res.status(200).json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
