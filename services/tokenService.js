import jwt from "jsonwebtoken";
import config from "config";
import dotenv from "dotenv";

dotenv.config();

// Fetch secret key from environment variable (dotenv) or fallback to config
const JWT_SECRET = process.env.JWT_SECRET || config.get("jwtSecret");
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || config.get("tokenExpiresIn");

/**
 * Generates a JWT authentication token containing user payload
 * @param {Object} user - The user document from MongoDB
 * @returns {string} The generated JWT token
 */
export const generateAuthToken = (user) => {
  const payload = {
    _id: user._id,
    isBusiness: user.isBusiness,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

/**
 * Verifies and decodes a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} The decoded payload if valid, or null if invalid/expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};