const { body, validationResult } = require('express-validator');

const validateActivity = [
  body('type').notEmpty().withMessage('Activity type is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('calories').isInt({ min: 0 }).withMessage('Calories must be a positive number'),
  body('intensity').isIn(['low', 'moderate', 'high']).withMessage('Invalid intensity level')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
};

module.exports = {
  validateActivity,
  handleValidationErrors
};
