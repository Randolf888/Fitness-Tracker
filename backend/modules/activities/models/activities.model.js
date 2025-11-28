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

activitySchema.index({ userId: 1, date: -1 });

const Activity = mongoose.model('Activity', activitySchema);

const buildActivityFilter = (query = {}) => {
  const {
    userId,
    type,
    intensity,
    startDate,
    endDate,
    minDuration,
    maxDuration,
    search
  } = query;

  const filter = {};

  if (userId) filter.userId = userId;
  if (type) filter.type = type;
  if (intensity) filter.intensity = intensity;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (minDuration || maxDuration) {
    filter.duration = {};
    if (minDuration) filter.duration.$gte = Number(minDuration);
    if (maxDuration) filter.duration.$lte = Number(maxDuration);
  }

  if (search) {
    filter.$or = [
      { notes: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } }
    ];
  }

  return filter;
};

const getAllActivities = async (query = {}) => {
  const {
    sortBy = 'date',
    sortOrder = 'desc',
    limit = 10,
    page = 1
  } = query;

  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const sanitizedPage = Math.max(1, parseInt(page, 10) || 1);

  const filter = buildActivityFilter(query);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (sanitizedPage - 1) * sanitizedLimit;

  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(sanitizedLimit)
      .populate('userId', 'username email'),
    Activity.countDocuments(filter)
  ]);

  return {
    activities,
    total,
    page: sanitizedPage,
    pages: Math.ceil(total / sanitizedLimit),
    limit: sanitizedLimit
  };
};

const getActivityById = async (id) => {
  return Activity.findById(id).populate('userId', 'username email');
};

const addNewActivity = async (activityData) => {
  const activity = new Activity(activityData);
  return activity.save();
};

const updateExistingActivity = async (id, updateData) => {
  return Activity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteActivity = async (id) => {
  return Activity.findByIdAndDelete(id);
};

module.exports = {
  Activity,
  getAllActivities,
  getActivityById,
  addNewActivity,
  updateExistingActivity,
  deleteActivity
};
