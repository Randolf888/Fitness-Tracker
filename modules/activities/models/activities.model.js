const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['running', 'walking', 'cycling', 'swimming', 'weightlifting', 'yoga', 'other']
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  distance: {
    type: Number,
    min: 0
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

const getAllActivities = async (query = {}) => {
  const { userId, type, sortBy = 'date', sortOrder = 'desc', limit = 10, page = 1 } = query;

  const filter = {};
  if (userId) filter.userId = userId;
  if (type) filter.type = type;

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const activities = await Activity.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'username email');

  const total = await Activity.countDocuments(filter);

  return {
    activities,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

const getActivityById = async (id) => {
  return await Activity.findById(id).populate('userId', 'username email');
};

const addNewActivity = async (activityData) => {
  const activity = new Activity(activityData);
  return await activity.save();
};

const updateExistingActivity = async (id, updateData) => {
  return await Activity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteActivity = async (id) => {
  return await Activity.findByIdAndDelete(id);
};

module.exports = {
  Activity,
  getAllActivities,
  getActivityById,
  addNewActivity,
  updateExistingActivity,
  deleteActivity
};
