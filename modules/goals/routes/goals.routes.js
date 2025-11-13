const express = require('express');
const {
  getAllGoals,
  getGoalById,
  addNewGoal,
  updateExistingGoal,
  deleteGoal
} = require('../models/goals.model');

const router = express.Router();

// GET all goals with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { goals, total, page, pages, limit } = await getAllGoals(req.query);

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

    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create goal
router.post('/', async (req, res) => {
  try {
    const goal = await addNewGoal(req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update goal
router.put('/:id', async (req, res) => {
  try {
    const goal = await updateExistingGoal(req.params.id, req.body);

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
    const goal = await deleteGoal(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
