const mongoose = require('mongoose');
const { Activity } = require('../../activities/models/activities.model');
const { Progress } = require('../../progress/models/progress.model');
const { Goal } = require('../../goals/models/goals.model');

const widgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  type: {
    type: String,
    required: true,
    enum: ['summary', 'chart', 'list', 'stat']
  },
  description: {
    type: String,
    maxlength: 500
  },
  config: {
    dataSource: {
      type: String,
      enum: ['activities', 'progress', 'goals', 'custom'],
      default: 'custom'
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    visualization: {
      type: String,
      enum: ['line', 'bar', 'pie', 'number', 'table', 'custom'],
      default: 'number'
    }
  }
}, {
  timestamps: true
});

widgetSchema.index({ userId: 1, type: 1 });

const DashboardWidget = mongoose.model('DashboardWidget', widgetSchema);

const buildWidgetFilter = (query = {}) => {
  const { userId, type, search } = query;
  const filter = {};

  if (userId) filter.userId = userId;
  if (type) filter.type = type;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  return filter;
};

const getDashboardWidgets = async (query = {}) => {
  const {
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 10,
    page = 1
  } = query;

  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const sanitizedPage = Math.max(1, parseInt(page, 10) || 1);

  const filter = buildWidgetFilter(query);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (sanitizedPage - 1) * sanitizedLimit;

  const [widgets, total] = await Promise.all([
    DashboardWidget.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(sanitizedLimit)
      .populate('userId', 'username email'),
    DashboardWidget.countDocuments(filter)
  ]);

  return {
    widgets,
    total,
    page: sanitizedPage,
    pages: Math.ceil(total / sanitizedLimit),
    limit: sanitizedLimit
  };
};

const getDashboardWidgetById = async (id) => {
  return DashboardWidget.findById(id).populate('userId', 'username email');
};

const createDashboardWidget = async (widgetData) => {
  const widget = new DashboardWidget(widgetData);
  return widget.save();
};

const updateDashboardWidget = async (id, updateData) => {
  return DashboardWidget.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteDashboardWidget = async (id) => {
  return DashboardWidget.findByIdAndDelete(id);
};

const getDashboardData = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activities = await Activity.find({
    userId,
    date: { $gte: thirtyDaysAgo }
  }).sort({ date: -1 }).limit(10);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const progress = await Progress.find({
    userId,
    createdAt: { $gte: sevenDaysAgo }
  }).sort({ date: -1 });

  const goals = await Goal.find({
    userId,
    status: 'in_progress'
  }).sort({ deadline: 1 });

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
  DashboardWidget,
  getDashboardWidgets,
  getDashboardWidgetById,
  createDashboardWidget,
  updateDashboardWidget,
  deleteDashboardWidget,
  getDashboardData
};
