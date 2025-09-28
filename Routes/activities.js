const express = require('express');
const router = express.Router();

// Dummy data for activities
let activities = [
  { id: 1, type: 'run', duration: 30, calories: 300, date: '2023-10-01' },
  { id: 2, type: 'walk', duration: 60, calories: 200, date: '2023-10-02' }
];

// GET /activities - get all activities
router.get('/', (req, res) => {
  res.json(activities);
});

// GET /activities/:id - get activity by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const activity = activities.find(a => a.id === id);
  if (activity) {
    res.json(activity);
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

// POST /activities - add a new activity
router.post('/', (req, res) => {
  const newActivity = { id: activities.length + 1, ...req.body };
  activities.push(newActivity);
  res.status(201).json(newActivity);
});

// PUT /activities/:id - update an activity
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = activities.findIndex(a => a.id === id);
  if (index !== -1) {
    activities[index] = { id, ...req.body };
    res.json(activities[index]);
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

// DELETE /activities/:id - delete an activity
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = activities.findIndex(a => a.id === id);
  if (index !== -1) {
    activities.splice(index, 1);
    res.json({ message: 'Activity deleted' });
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

module.exports = router;
