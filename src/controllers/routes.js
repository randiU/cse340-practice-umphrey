import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { countDemoRequests } from '../middleware/demo/countDemoRequests.js';
import { catalogPage, courseDetailPage, randomCoursePage } from './catalog/catalog.js';
import { departmentPage } from './department/department.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/random', randomCoursePage);
router.get('/catalog/:courseId', courseDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, countDemoRequests, demoPage);

// Departments page
router.get('/departments', departmentPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;