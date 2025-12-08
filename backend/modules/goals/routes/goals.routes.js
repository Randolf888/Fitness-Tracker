const express = require('express');
const {
  getAllGoals,
  getGoalById,
  addNewGoal,
  updateExistingGoal,
  deleteGoal
} = require('../models/goals.model');
const { authenticate, authorize } = require('../../../middlewares/authMiddleware');

const router = express.Router();
const canAccess = (req, resourceUserId) => {
  const ownerId = resourceUserId?._id ? resourceUserId._id.toString() : resourceUserId?.toString();
  return req.user.role === 'admin' || ownerId === req.user.id;
};

router.use(authenticate);
router.use(authorize('admin', 'customer'));

// GET all goals with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const query = { ...req.query };

    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const { goals, total, page, pages, limit } = await getAllGoals(query);

    res.status(200).json({
      success: true,
      data: goals,
      pagination: { total, page, pages, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET goal by ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await getGoalById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (!canAccess(req, goal.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view this goal' });
    }

    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create goal
router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.role === 'admin' ? (req.body.userId || req.user.id) : req.user.id
    };

    const goal = await addNewGoal(payload);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update goal
router.put('/:id', async (req, res) => {
  try {
    const existing = await getGoalById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update this goal' });
    }

    const payload = {
      ...req.body
    };

    if (req.user.role !== 'admin') {
      payload.userId = req.user.id;
    }

    const goal = await updateExistingGoal(req.params.id, payload);


    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE goal
router.delete('/:id', async (req, res) => {
  try {
    const existing = await getGoalById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot delete this goal' });
    }

    const goal = await deleteGoal(req.params.id);


    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
