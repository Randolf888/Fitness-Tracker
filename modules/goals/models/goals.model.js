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

const Goal = mongoose.model('Goal', goalSchema);

const getAllGoals = async (query = {}) => {
  const { userId, type, status, sortBy = 'createdAt', sortOrder = 'desc', limit = 10, page = 1 } = query;

  const filter = {};
  if (userId) filter.userId = userId;
  if (type) filter.type = type;
  if (status) filter.status = status;

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const goals = await Goal.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'username email');

  const total = await Goal.countDocuments(filter);

  return {
    goals,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

const getGoalById = async (id) => {
  return await Goal.findById(id).populate('userId', 'username email');
};

const addNewGoal = async (goalData) => {
  const goal = new Goal(goalData);
  return await goal.save();
};

const updateExistingGoal = async (id, updateData) => {
  return await Goal.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteGoal = async (id) => {
  return await Goal.findByIdAndDelete(id);
};

module.exports = {
  Goal,
  getAllGoals,
  getGoalById,
  addNewGoal,
  updateExistingGoal,
  deleteGoal
};
