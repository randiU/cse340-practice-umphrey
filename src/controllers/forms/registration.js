import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers, deleteUserById } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('phone')
        .trim()
        .isMobilePhone().withMessage('Enter a valid phone number')
        .isLength({ min: 10, max: 20 }).withMessage('Phone number should be 10-20 digits')
        .escape(),
    body('address')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters')
        .escape(),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });

};

/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //Log validation errors to console for debugging
        console.error('Validation errors:', errors.array());
        //Redirect back to /register
        return res.redirect('/register');
    }

    // Extract validated data from request body
    const { name, phone, address, email, password } = req.body;

    try {
        // Check if email already exists in database
        const emailAlreadyExists = await emailExists(email);

        if (emailAlreadyExists) {
            console.error('Email already registered');
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save user to database with hashed password and all fields
        const newUser = await saveUser(name, phone, address, email, hashedPassword);
        //Log success message to console
        console.log('User registered successfully:', newUser);
        //Redirect to /register/list to show successful registration
        return res.redirect('/register/list');
        // NOTE: Later when we add authentication, we'll change this to require login first
    } catch (error) {
        // TODO: Log the error to console
        console.error('Error during registration:', error);
        // TODO: Redirect back to /register
        return res.redirect('/register');
    }
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error('Error fetching users:', error);
        // users remains empty array on error
    }

    // TODO: Render the users list view (forms/registration/list)
    res.render('forms/registration/list', {
        title: 'Registered Users',
        users
    });

};

/**
 * Handle deleting a user by ID.
 */
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deleted = await deleteUserById(userId);
        if (deleted) {
            console.log(`User ${userId} deleted.`);
        } else {
            console.warn(`User ${userId} not found for deletion.`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
    return res.redirect('/register/list');
};

/**
 * POST /register/delete/:id - Delete a user by ID
 */
router.post('/delete/:id', deleteUser);

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;