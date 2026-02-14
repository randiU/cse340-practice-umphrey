import bcrypt from 'bcrypt';
import db from '../db.js';

/**
 * Find a user by email address for login verification.
 * 
 * @param {string} email - Email address to search for
 * @returns {Promise<Object|null>} User object with password hash or null if not found
 */
const findUserByEmail = async (email) => {
    //Create sql query to find user by email, using LOWER() for case-insensitive match
    const query = `
        SELECT id, name, email, password, created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1
    `;
    //returns result of query, which is an array of rows. We want the first row (if it exists) or null if no user found
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

/**
 * Verify a plain text password against a stored bcrypt hash.
 * 
 * @param {string} plainPassword - The password to verify
 * @param {string} hashedPassword - The stored password hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
    // Use bcrypt.compare() to verify the password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    // Return the result (true/false)
    return isMatch;
};

export { findUserByEmail, verifyPassword };