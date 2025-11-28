const express = require('express');
const {
  getDashboardWidgets,
  getDashboardWidgetById,
  createDashboardWidget,
  updateDashboardWidget,
  deleteDashboardWidget,
  getDashboardData
} = require('../models/dashboard.model');

const router = express.Router();

// GET dashboard widgets with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { widgets, total, page, pages, limit } = await getDashboardWidgets(req.query);

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
    res.status(200).json({ success: true, data: widget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create dashboard widget
router.post('/', async (req, res) => {
  try {
    const widget = await createDashboardWidget(req.body);
    res.status(201).json({ success: true, data: widget });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update dashboard widget
router.put('/:id', async (req, res) => {
  try {
    const widget = await updateDashboardWidget(req.params.id, req.body);
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
