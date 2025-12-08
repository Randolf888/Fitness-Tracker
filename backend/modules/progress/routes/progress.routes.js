const express = require('express');
const {
  getAllProgress,
  getProgressById,
  addProgress,
  updateProgress,
  deleteProgress
} = require('../models/progress.model');
const { authenticate, authorize } = require('../../../middlewares/authMiddleware');

const router = express.Router();
const canAccess = (req, resourceUserId) => {
  const ownerId = resourceUserId?._id ? resourceUserId._id.toString() : resourceUserId?.toString();
  return req.user.role === 'admin' || ownerId === req.user.id;
};

router.use(authenticate);
router.use(authorize('admin', 'customer'));

// GET all progress records with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const query = { ...req.query };

    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const { progress, total, page, pages, limit } = await getAllProgress(query);

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

    if (!canAccess(req, progress.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view this progress record' });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create progress record
router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.role === 'admin' ? (req.body.userId || req.user.id) : req.user.id
    };

    const progress = await addProgress(payload);
    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update progress record
router.put('/:id', async (req, res) => {
  try {
    const existing = await getProgressById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update this progress record' });
    }

    const payload = { ...req.body };

    if (req.user.role !== 'admin') {
      payload.userId = req.user.id;
    }

    const progress = await updateProgress(req.params.id, payload);


    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE progress record
router.delete('/:id', async (req, res) => {
  try {
    const existing = await getProgressById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot delete this progress record' });
    }

    const progress = await deleteProgress(req.params.id);


    res.status(200).json({ success: true, message: 'Progress record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
