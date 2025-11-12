const express = require('express');
const goalsModel = require('../models/goals.model');

const router = express.Router();

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// GET all goals with search, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    const { skip, limit } = getPaginationParams(req.query);

    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = sort ? Object.fromEntries(
      sort.split(',').map(s => [s.startsWith('-') ? s.slice(1) : s, s.startsWith('-') ? -1 : 1])
    ) : { createdAt: -1 };

    const goals = await goalsModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await goalsModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: goals,
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

// GET goal by ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await goalsModel.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create goal
router.post('/', async (req, res) => {
  try {
    const goal = await goalsModel.create(req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update goal
router.put('/:id', async (req, res) => {
  try {
    const goal = await goalsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await goalsModel.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
