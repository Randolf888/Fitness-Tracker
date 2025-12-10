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
    type: Date,
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

const buildProgressFilter = (query = {}) => {
  const {
    userId,
    startDate,
    endDate,
    minSteps,
    maxSteps,
    minCaloriesBurned,
    maxCaloriesBurned,
    workoutType
  } = query;

  const filter = {};

  if (userId) filter.userId = userId;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (minSteps || maxSteps) {
    filter['metrics.steps'] = {};
    if (minSteps) filter['metrics.steps'].$gte = Number(minSteps);
    if (maxSteps) filter['metrics.steps'].$lte = Number(maxSteps);
  }

  if (minCaloriesBurned || maxCaloriesBurned) {
    filter['metrics.caloriesBurned'] = {};
    if (minCaloriesBurned) filter['metrics.caloriesBurned'].$gte = Number(minCaloriesBurned);
    if (maxCaloriesBurned) filter['metrics.caloriesBurned'].$lte = Number(maxCaloriesBurned);
  }

  if (workoutType) {
    filter['workouts.type'] = workoutType;
  }

  return filter;
};

const getAllProgress = async (query = {}) => {
  const {
    sortBy = 'date',
    sortOrder = 'desc',
    limit = 10,
    page = 1
  } = query;

  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const sanitizedPage = Math.max(1, parseInt(page, 10) || 1);

  const filter = buildProgressFilter(query);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (sanitizedPage - 1) * sanitizedLimit;

  const [progress, total] = await Promise.all([
    Progress.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(sanitizedLimit)
      .populate('userId', 'username email'),
    Progress.countDocuments(filter)
  ]);

  return {
    progress,
    total,
    page: sanitizedPage,
    pages: Math.ceil(total / sanitizedLimit),
    limit: sanitizedLimit
  };
};

const getProgressById = async (id) => {
  return Progress.findById(id).populate('userId', 'username email');
};

const addProgress = async (progressData) => {
  const progress = new Progress(progressData);
  return progress.save();
};

const updateProgress = async (id, updateData) => {
  return Progress.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteProgress = async (id) => {
  return Progress.findByIdAndDelete(id);
};

module.exports = {
  Progress,
  getAllProgress,
  getProgressById,
  addProgress,
  updateProgress,
  deleteProgress
};
