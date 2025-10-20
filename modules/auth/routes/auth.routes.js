const express = require('express');
const router = express.Router();
const authModel = require('../models/auth.model');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middlewares/auth.middleware');

// POST /auth/register
router.post('/register', validateRegistration, handleValidationErrors, (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if user already exists
    const existingUser = authModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const newUser = authModel.createUser({ email, username, password });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// POST /auth/login
router.post('/login', validateLogin, handleValidationErrors, (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = authModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password (in real app, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// GET /auth/profile/:id
router.get('/profile/:id', (req, res) => {
  try {
    const user = authModel.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;
