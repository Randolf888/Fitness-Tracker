const express = require('express');
const router = express.Router();
const progressModel = require('../models/progress.model');
const { validateProgress, handleValidationErrors } = require('../middlewares/progress.middleware');

// GET /progress
router.get('/', (req, res) => {
  try {
    const progress = progressModel.getAllProgress();
    res.status(200).json({
      success: true,
      data: progress,
      count: progress.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress data',
      error: error.message
    });
  }
});

// GET /progress/date/:date
router.get('/date/:date', (req, res) => {
  try {
    const progress = progressModel.getProgressByDate(req.params.date);
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress data not found for this date'
      });
    }
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress data',
      error: error.message
    });
  }
});

// GET /progress/:id
router.get('/:id', (req, res) => {
  try {
    const progress = progressModel.getProgressById(req.params.id);
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress record',
      error: error.message
    });
  }
});

// POST /progress
router.post('/', validateProgress, handleValidationErrors, (req, res) => {
  try {
    const newProgress = progressModel.addProgress(req.body);
    res.status(201).json({
      success: true,
      message: 'Progress data added successfully',
      data: newProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add progress data',
      error: error.message
    });
  }
});

// PUT /progress/:id
router.put('/:id', validateProgress, handleValidationErrors, (req, res) => {
  try {
    const updatedProgress = progressModel.updateProgress(req.params.id, req.body);
    if (!updatedProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Progress data updated successfully',
      data: updatedProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update progress data',
      error: error.message
    });
  }
});

module.exports = router;
