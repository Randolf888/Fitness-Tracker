const express = require('express');
const app = express();
const port = 3000;

// Import routes
const authRoutes = require('./auth');
const activityRoutes = require('./activities');
const dashboardRoutes = require('./dashboard');
const profileRoutes = require('./Profile');
const goalsRoutes = require('./goals');
const progressRoutes = require('./progress');

// Use routes
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);
app.use('/goals', goalsRoutes);
app.use('/progress', progressRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'FitTracker Pro API is running!' });
});

// Start server
app.listen(port, () => {
  console.log(`FitTracker Pro server running on http://localhost:${port}`);
});