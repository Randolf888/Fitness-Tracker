const express = require('express');
const progressModel = require('../models/progress.model');

const router = express.Router();

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// GET all progress records with search, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    const { skip, limit } = getPaginationParams(req.query);

    let query = {};
    
    if (search) {
      query.$or = [
        { activity: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = sort ? Object.fromEntries(
      sort.split(',').map(s => [s.startsWith('-') ? s.slice(1) : s, s.startsWith('-') ? -1 : 1])
    ) : { date: -1 };

    const progress = await progressModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await progressModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: progress,
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

// GET progress by ID
router.get('/:id', async (req, res) => {
  try {
    const progress = await progressModel.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create progress record
router.post('/', async (req, res) => {
  try {
    const progress = await progressModel.create(req.body);
    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update progress record
router.put('/:id', async (req, res) => {
  try {
    const progress = await progressModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE progress record
router.delete('/:id', async (req, res) => {
  try {
    const progress = await progressModel.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }
    res.status(200).json({ success: true, message: 'Progress record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
