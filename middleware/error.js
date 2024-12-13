// // src/middleware/error.js

// // src/middleware/errorHandler.js
const ErrorResponse = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};