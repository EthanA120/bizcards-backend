import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The generated password hash
 */
export const generateHash = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password
 * @param {string} password - The plain text password provided by the user
 * @param {string} hash - The hashed password stored in the database
 * @returns {Promise<boolean>} True if the passwords match, false otherwise
 */
export const compareHash = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};