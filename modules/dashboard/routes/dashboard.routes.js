const express = require('express');
const dashboardModel = require('../models/dashboard.model');

const router = express.Router();

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// GET dashboard data with search, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    const { skip, limit } = getPaginationParams(req.query);

    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = sort ? Object.fromEntries(
      sort.split(',').map(s => [s.startsWith('-') ? s.slice(1) : s, s.startsWith('-') ? -1 : 1])
    ) : { createdAt: -1 };

    const dashboard = await dashboardModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await dashboardModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: dashboard,
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

// GET dashboard widget by ID
router.get('/:id', async (req, res) => {
  try {
    const widget = await dashboardModel.findById(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create dashboard widget
router.post('/', async (req, res) => {
  try {
    const widget = await dashboardModel.create(req.body);
    res.status(201).json({ success: true, data: widget });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update dashboard widget
router.put('/:id', async (req, res) => {
  try {
    const widget = await dashboardModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE dashboard widget
router.delete('/:id', async (req, res) => {
  try {
    const widget = await dashboardModel.findByIdAndDelete(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }
    res.status(200).json({ success: true, message: 'Dashboard widget deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
