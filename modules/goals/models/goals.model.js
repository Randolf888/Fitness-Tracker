const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['daily_steps', 'weekly_workouts', 'monthly_distance', 'weight_loss', 'muscle_gain', 'other']
  },
  target: {
    type: Number,
    required: true,
    min: 0
  },
  current: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed'],
    default: 'in_progress'
  },
  description: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

goalSchema.index({ userId: 1, deadline: 1 });

const Goal = mongoose.model('Goal', goalSchema);

const buildGoalFilter = (query = {}) => {
  const {
    userId,
    type,
    status,
    dueBefore,
    dueAfter,
    minCurrent,
    maxCurrent,
    search
  } = query;

  const filter = {};

  if (userId) filter.userId = userId;
  if (type) filter.type = type;
  if (status) filter.status = status;

  if (dueBefore || dueAfter) {
    filter.deadline = {};
    if (dueAfter) filter.deadline.$gte = new Date(dueAfter);
    if (dueBefore) filter.deadline.$lte = new Date(dueBefore);
  }

  if (minCurrent || maxCurrent) {
    filter.current = {};
    if (minCurrent) filter.current.$gte = Number(minCurrent);
    if (maxCurrent) filter.current.$lte = Number(maxCurrent);
  }

  if (search) {
    filter.$or = [
      { description: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } }
    ];
  }

  return filter;
};

const getAllGoals = async (query = {}) => {
  const {
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 10,
    page = 1
  } = query;

  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const sanitizedPage = Math.max(1, parseInt(page, 10) || 1);

  const filter = buildGoalFilter(query);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (sanitizedPage - 1) * sanitizedLimit;

  const [goals, total] = await Promise.all([
    Goal.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(sanitizedLimit)
      .populate('userId', 'username email'),
    Goal.countDocuments(filter)
  ]);

  return {
    goals,
    total,
    page: sanitizedPage,
    pages: Math.ceil(total / sanitizedLimit),
    limit: sanitizedLimit
  };
};

const getGoalById = async (id) => {
  return Goal.findById(id).populate('userId', 'username email');
};

const addNewGoal = async (goalData) => {
  const goal = new Goal(goalData);
  return goal.save();
};

const updateExistingGoal = async (id, updateData) => {
  return Goal.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteGoal = async (id) => {
  return Goal.findByIdAndDelete(id);
};

module.exports = {
  Goal,
  getAllGoals,
  getGoalById,
  addNewGoal,
  updateExistingGoal,
  deleteGoal
};
