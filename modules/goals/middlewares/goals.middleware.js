const { body, validationResult } = require('express-validator');

const validateGoal = [
  body('type').notEmpty().withMessage('Goal type is required'),
  body('target').isInt({ min: 1 }).withMessage('Target must be a positive number'),
  body('deadline').isDate().withMessage('Valid deadline date is required')
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
  validateGoal,
  handleValidationErrors
};
