import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { countDemoRequests } from '../middleware/demo/countDemoRequests.js';
import { catalogPage, courseDetailPage, randomCoursePage } from './catalog/catalog.js';
// import { departmentPage } from './department/department.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { showContactForm, handleContactSubmission, showContactResponses } from './forms/contact.js';
import { showRegistrationForm, processRegistration, showAllUsers, showEditAccountForm, processEditAccount, processDeleteAccount } from './forms/registration.js';
import { showLoginForm, processLogin, processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import { registrationValidation, editValidation, contactValidation, loginValidation } from '../middleware/validation/forms.js';

// Create a new router instance
const router = Router();

// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    res.addScript('<script src="/js/catalog.js"></script>');
    next();
});

// Add faculty-specific styles to all faculty routes
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    res.addScript('<script src="/js/faculty.js"></script>');
    next();
});

// Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles to all login routes
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/random', randomCoursePage);
router.get('/catalog/:slugId', courseDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, countDemoRequests, demoPage);

// Departments page
// router.get('/departments', departmentPage);

//Faculty page
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);



// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// Registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/register/list', requireLogin, showAllUsers);
router.get('/register/:id/edit', requireLogin, showEditAccountForm);
router.post('/register/:id/edit', requireLogin, editValidation, processEditAccount);
router.post('/register/:id/delete', requireLogin, processDeleteAccount);


// Contact form routes
router.get('/contact', showContactForm);
router.post('/contact', contactValidation, handleContactSubmission);
router.get('/contact/responses', requireLogin, showContactResponses);

// Login routes
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);

export default router;