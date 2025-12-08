const express = require('express');
const {
  getDashboardWidgets,
  getDashboardWidgetById,
  createDashboardWidget,
  updateDashboardWidget,
  deleteDashboardWidget,
  getDashboardData
} = require('../models/dashboard.model');
const { authenticate, authorize } = require('../../../middlewares/authMiddleware');

const router = express.Router();
const canAccess = (req, resourceUserId) => {
  const ownerId = resourceUserId?._id ? resourceUserId._id.toString() : resourceUserId?.toString();
  return req.user.role === 'admin' || ownerId === req.user.id;
};

router.use(authenticate);
router.use(authorize('admin', 'customer'));

// GET dashboard widgets with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const query = { ...req.query };

    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const { widgets, total, page, pages, limit } = await getDashboardWidgets(query);

    res.status(200).json({
      success: true,
      data: widgets,
      pagination: { total, page, pages, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET aggregated dashboard data for a user
router.get('/summary/:userId', async (req, res) => {
  try {
    if (!canAccess(req, req.params.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view this dashboard' });
    }

    const data = await getDashboardData(req.params.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET dashboard widget by ID
router.get('/:id', async (req, res) => {
  try {
    const widget = await getDashboardWidgetById(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }

    if (!canAccess(req, widget.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot view this widget' });
    }
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create dashboard widget
router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.role === 'admin' ? (req.body.userId || req.user.id) : req.user.id
    };

    const widget = await createDashboardWidget(payload);
    res.status(201).json({ success: true, data: widget });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update dashboard widget
router.put('/:id', async (req, res) => {
  try {
    const existing = await getDashboardWidgetById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update this widget' });
    }

    const payload = { ...req.body };
    if (req.user.role !== 'admin') {
      payload.userId = req.user.id;
    }

    const widget = await updateDashboardWidget(req.params.id, payload);
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
    const existing = await getDashboardWidgetById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }

    if (!canAccess(req, existing.userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot delete this widget' });
    }

    const widget = await deleteDashboardWidget(req.params.id);
    if (!widget) {
      return res.status(404).json({ success: false, message: 'Dashboard widget not found' });
    }
    res.status(200).json({ success: true, message: 'Dashboard widget deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
