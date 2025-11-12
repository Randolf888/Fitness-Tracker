const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
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
  completed: {
    type: Boolean,
    default: false
  }
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  metrics: {
    steps: {
      type: Number,
      default: 0,
      min: 0
    },
    caloriesBurned: {
      type: Number,
      default: 0,
      min: 0
    },
    activeMinutes: {
      type: Number,
      default: 0,
      min: 0
    },
    distance: {
      type: Number,
      default: 0,
      min: 0
    },
    sleepHours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24
    },
    waterIntake: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  goals: {
    dailySteps: {
      type: Number,
      default: 10000,
      min: 0
    },
    dailyCalories: {
      type: Number,
      default: 2000,
      min: 0
    },
    weeklyWorkouts: {
      type: Number,
      default: 5,
      min: 0
    },
    sleepTarget: {
      type: Number,
      default: 8,
      min: 0,
      max: 24
    }
  },
  achievement: {
    stepsProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    caloriesProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    workoutsCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    sleepQuality: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  workouts: [workoutSchema]
}, {
  timestamps: true
});

// Compound index to ensure one progress entry per user per date
progressSchema.index({ userId: 1, date: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

const getAllProgress = async (query = {}) => {
  const { userId, startDate, endDate, sortBy = 'date', sortOrder = 'desc', limit = 10, page = 1 } = query;

  const filter = {};
  if (userId) filter.userId = userId;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const progress = await Progress.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'username email');

  const total = await Progress.countDocuments(filter);

  return {
    progress,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

const getProgressByDate = async (date, userId) => {
  return await Progress.findOne({ date, userId }).populate('userId', 'username email');
};

const getProgressById = async (id) => {
  return await Progress.findById(id).populate('userId', 'username email');
};

const addProgress = async (progressData) => {
  const progress = new Progress(progressData);
  return await progress.save();
};

const updateProgress = async (id, updateData) => {
  return await Progress.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteProgress = async (id) => {
  return await Progress.findByIdAndDelete(id);
};

module.exports = {
  Progress,
  getAllProgress,
  getProgressByDate,
  getProgressById,
  addProgress,
  updateProgress,
  deleteProgress
};
