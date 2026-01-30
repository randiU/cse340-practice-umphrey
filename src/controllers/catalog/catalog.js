import { getAllCourses, getCourseById, getSortedSections } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
//I had chatgpt help with some of the logic for sorting courses by credit hours
const catalogPage = (req, res) => {
    let coursesObj = getAllCourses();
    const sort = req.query.sort;
    let coursesArr = Object.values(coursesObj);
    if (sort === 'credits') {
        coursesArr = coursesArr.slice().sort((a, b) => a.credits - b.credits);
    }
    // Build a new object with the same keys as the original, but sorted if needed
    let sortedCoursesObj = {};
    if (sort === 'credits') {
        // Rebuild as object with course.id as key
        coursesArr.forEach(course => {
            sortedCoursesObj[course.id] = course;
        });
    } else {
        sortedCoursesObj = coursesObj;
    }
    res.render('catalog', {
        title: 'Course Catalog',
        courses: sortedCoursesObj,
        currentSort: sort || ''
    });
};

// Route handler for individual course detail pages
const courseDetailPage = (req, res, next) => {
    const courseId = req.params.courseId;
    const course = getCourseById(courseId);

    // If course doesn't exist, create 404 error
    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    const sortedSections = getSortedSections(course.sections, sortBy);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
};

const randomCoursePage = (req, res, next) => {
    const courses = getAllCourses();
    const courseIds = Object.keys(courses);
    const randomId = courseIds[Math.floor(Math.random() * courseIds.length)];
    res.redirect(`/catalog/${randomId}`);
}


export { catalogPage, courseDetailPage, randomCoursePage };