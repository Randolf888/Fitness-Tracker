const mongoose = require('mongoose');
const { Activity } = require('../activities/models/activities.model');
const { Progress } = require('../progress/models/progress.model');
const { Goal } = require('../goals/models/goals.model');

const getDashboardData = async (userId) => {
  // Get recent activities (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activities = await Activity.find({
    userId,
    date: { $gte: thirtyDaysAgo }
  }).sort({ date: -1 }).limit(10);

  // Get recent progress (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const progress = await Progress.find({
    userId,
    createdAt: { $gte: sevenDaysAgo }
  }).sort({ date: -1 });

  // Get current goals
  const goals = await Goal.find({
    userId,
    status: 'in_progress'
  }).sort({ deadline: 1 });

  // Calculate summary stats
  const totalActivities = await Activity.countDocuments({ userId });
  const totalSteps = await Progress.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$metrics.steps' } } }
  ]);
  const totalCalories = await Activity.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$calories' } } }
  ]);
  const avgSleep = await Progress.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, avg: { $avg: '$metrics.sleepHours' } } }
  ]);

  return {
    summary: {
      totalActivities,
      totalSteps: totalSteps[0]?.total || 0,
      totalCaloriesBurned: totalCalories[0]?.total || 0,
      averageSleep: avgSleep[0]?.avg ? avgSleep[0].avg.toFixed(1) : 0
    },
    recentActivities: activities,
    currentGoals: goals,
    progressTrend: progress
  };
};

module.exports = {
  getDashboardData
};
