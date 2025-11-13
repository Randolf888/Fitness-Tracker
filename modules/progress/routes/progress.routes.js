const express = require('express');
const {
  getAllProgress,
  getProgressById,
  addProgress,
  updateProgress,
  deleteProgress
} = require('../models/progress.model');

const router = express.Router();

// GET all progress records with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { progress, total, page, pages, limit } = await getAllProgress(req.query);

    res.status(200).json({
      success: true,
      data: progress,
      pagination: { total, page, pages, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET progress by ID
router.get('/:id', async (req, res) => {
  try {
    const progress = await getProgressById(req.params.id);

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
    const progress = await addProgress(req.body);
    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update progress record
router.put('/:id', async (req, res) => {
  try {
    const progress = await updateProgress(req.params.id, req.body);

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
    const progress = await deleteProgress(req.params.id);

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    res.status(200).json({ success: true, message: 'Progress record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
