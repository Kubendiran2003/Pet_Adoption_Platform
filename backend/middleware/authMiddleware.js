import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/userModel.js';

/**
 * Protect routes - verify JWT token and set req.user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user to req.user
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

/**
 * Check if user is an organization/shelter
 */
export const isShelter = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'shelter') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a shelter/organization');
  }
});

/**
 * Check if user is an admin
 */
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
});