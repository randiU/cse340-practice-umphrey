import { getAllCourses, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
//I had chatgpt help with some of the logic for sorting courses by credit hours
const catalogPage = async(req, res) => {
    let coursesObj = await getAllCourses();
    const sort = req.query.sort;
    let coursesArr = Object.values(coursesObj);
    // console.log(coursesObj);
    if (sort === 'credits') {
        coursesArr = coursesArr.slice().sort((a, b) => a.creditHours - b.creditHours);
    }
    res.render('catalog/list', {
        title: 'Course Catalog',
        courses: coursesArr,
        currentSort: sort || ''
    });
};

// Route handler for individual course detail pages
//bio-111 and chem-111 don't have any sections associated with them in the catalog table
const courseDetailPage = async (req, res, next) => {
    const courseSlug = req.params.slugId;
    console.log('Looking for course with slug:', courseSlug);
    const course = await getCourseBySlug(courseSlug);
    console.log('Found course:', course);
    // If course doesn't exist, create 404 error
   if (Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    const sections = await getSectionsByCourseSlug(courseSlug, sortBy);
    console.log('sections:', sections); 
    res.render('catalog/details', {
        title: `${course.name} - ${course.courseCode}`,
        course: { ...course, sections: sections },
        currentSort: sortBy
    });
};

const randomCoursePage = async(req, res, next) => {
    const courses = await getAllCourses();
    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
    console.log('Random course selected:', randomCourse.slug);
    res.redirect(`/catalog/${randomCourse.slug}`);
}


export { catalogPage, courseDetailPage, randomCoursePage };