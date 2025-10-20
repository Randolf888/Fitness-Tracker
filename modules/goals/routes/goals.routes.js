const express = require('express');
const router = express.Router();
const goalModel = require('../models/goals.model');
const { validateGoal, handleValidationErrors } = require('../middlewares/goals.middleware');

// GET /goals - Get all goals
router.get('/', (req, res) => {
  try {
    const goals = goalModel.getAllGoals();
    res.status(200).json({
      success: true,
      data: goals,
      count: goals.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals',
      error: error.message
    });
  }
});

// GET /goals/:id - Get goal by ID
router.get('/:id', (req, res) => {
  try {
    const goal = goalModel.getGoalById(req.params.id);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal',
      error: error.message
    });
  }
});

// POST /goals - Create new goal
router.post('/', validateGoal, handleValidationErrors, (req, res) => {
  try {
    const newGoal = goalModel.addNewGoal(req.body);
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: newGoal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create goal',
      error: error.message
    });
  }
});

// PUT /goals/:id - Update goal
router.put('/:id', validateGoal, handleValidationErrors, (req, res) => {
  try {
    const updatedGoal = goalModel.updateExistingGoal(req.params.id, req.body);
    if (!updatedGoal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update goal',
      error: error.message
    });
  }
});

// DELETE /goals/:id - Delete goal
router.delete('/:id', (req, res) => {
  try {
    const deleted = goalModel.deleteGoal(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete goal',
      error: error.message
    });
  }
});

module.exports = router;
