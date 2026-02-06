import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { countDemoRequests } from '../middleware/demo/countDemoRequests.js';
import { catalogPage, courseDetailPage, randomCoursePage } from './catalog/catalog.js';
// import { departmentPage } from './department/department.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

// Create a new router instance
const router = Router();

// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// Add faculty-specific styles to all faculty routes
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
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

export default router;