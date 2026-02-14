
import db from '../db.js';
/**
 * Deletes a user from the database by ID.
 * @param {number} id - The user's ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
const deleteUserById = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

/**
 * Checks if an email address is already registered in the database.
 * 
 * @param {string} email - The email address to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;
    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};

/**
 * Saves a new user to the database with a hashed password.
 * 
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} hashedPassword - The bcrypt-hashed password
 * @returns {Promise<Object>} The newly created user record (without password)
 */
const saveUser = async (name, phone, address, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, phone, address, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, phone, address, email, created_at
    `;
    const result = await db.query(query, [name, phone, address, email, hashedPassword]);
    return result.rows[0];
};

/**
 * Retrieves all registered users from the database.
 * 
 * @returns {Promise<Array>} Array of user records (without passwords)
 */
const getAllUsers = async () => {
    const query = `
        SELECT id, name, phone, address, email, created_at
        FROM users
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

export { emailExists, saveUser, getAllUsers, deleteUserById };