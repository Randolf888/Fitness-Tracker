const { body, validationResult } = require('express-validator');

const validateProgress = [
  body('date').isDate().withMessage('Valid date is required'),
  body('metrics.steps').isInt({ min: 0 }).withMessage('Steps must be a positive number'),
  body('metrics.caloriesBurned').isInt({ min: 0 }).withMessage('Calories must be a positive number'),
  body('metrics.sleepHours').isFloat({ min: 0, max: 24 }).withMessage('Sleep hours must be between 0 and 24')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
};

module.exports = {
  validateProgress,
  handleValidationErrors
};
