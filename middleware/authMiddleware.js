const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];
      
      console.log('Received token:', token); // Debug
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET); // Debug

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug

      // Get user from database and attach to req object
      req.user = await User.findById(decoded.id);
      console.log('Found user:', req.user); // Debug

      if (!req.user) {
        res.status(401);
        return next(new Error('User not found'));
      }

      next();
    } catch (error) {
      console.log('JWT Error:', error.message); // Debug
      res.status(401);
      next(new Error('Not authorized, token failed: ' + error.message));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// Middleware to restrict access to specific roles (e.g., Admin only)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`User role ${req.user.role} is not authorized to access this route`));
    }
    next();
  };
};

module.exports = { protect, authorize };