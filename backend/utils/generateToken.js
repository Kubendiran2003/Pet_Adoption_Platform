import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authenticated users
 * @param {String} id - User ID to include in the token
 * @returns {String} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export default generateToken;