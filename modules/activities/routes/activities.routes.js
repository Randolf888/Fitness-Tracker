const express = require('express');
const activitiesModel = require('../models/activities.model');

const router = express.Router();

// Helper function for pagination and sorting
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// GET all activities with search, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    const { skip, limit } = getPaginationParams(req.query);

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = sort ? Object.fromEntries(
      sort.split(',').map(s => [s.startsWith('-') ? s.slice(1) : s, s.startsWith('-') ? -1 : 1])
    ) : { createdAt: -1 };

    const activities = await activitiesModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await activitiesModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: parseInt(req.query.page) || 1,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET activity by ID
router.get('/:id', async (req, res) => {
  try {
    const activity = await activitiesModel.findById(req.params.id);
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
    const activity = await activitiesModel.create(req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update activity
router.put('/:id', async (req, res) => {
  try {
    const activity = await activitiesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const activity = await activitiesModel.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.status(200).json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
