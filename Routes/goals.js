const express = require('express');
const router = express.Router();

// Dummy data for goals
let goals = [
  { id: 1, type: 'dailySteps', target: 10000, current: 8500 },
  { id: 2, type: 'weeklyCalories', target: 14000, current: 12000 }
];

// GET /goals - get all goals
router.get('/', (req, res) => {
  res.json(goals);
});

// GET /goals/:id - get goal by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const goal = goals.find(g => g.id === id);
  if (goal) {
    res.json(goal);
  } else {
    res.status(404).json({ message: 'Goal not found' });
  }
});

// POST /goals - add a new goal
router.post('/', (req, res) => {
  const newGoal = { id: goals.length + 1, ...req.body };
  goals.push(newGoal);
  res.status(201).json(newGoal);
});

// PUT /goals/:id - update a goal
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { id, ...req.body };
    res.json(goals[index]);
  } else {
    res.status(404).json({ message: 'Goal not found' });
  }
});

// DELETE /goals/:id - delete a goal
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals.splice(index, 1);
    res.json({ message: 'Goal deleted' });
  } else {
    res.status(404).json({ message: 'Goal not found' });
  }
});

module.exports = router;
