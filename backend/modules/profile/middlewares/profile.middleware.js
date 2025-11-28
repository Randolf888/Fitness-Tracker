const { body, validationResult } = require('express-validator');

const validateProfileUpdate = [
  body('username').optional().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('profile.age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('profile.weight').optional().isFloat({ min: 1 }).withMessage('Weight must be a positive number'),
  body('profile.height').optional().isInt({ min: 1 }).withMessage('Height must be a positive number')
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
  validateProfileUpdate,
  handleValidationErrors
};
