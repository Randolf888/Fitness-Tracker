// Dashboard specific middlewares can be added here
const validateDashboardRequest = (req, res, next) => {
  // Could validate user permissions, etc.
  next();
};

module.exports = {
  validateDashboardRequest
};
