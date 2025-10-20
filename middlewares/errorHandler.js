// Global error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('Error Stack:', error.stack);
  console.error('Error Details:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    // Only show error details in development
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

module.exports = errorHandler;
