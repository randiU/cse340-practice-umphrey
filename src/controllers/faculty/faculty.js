import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res) => {
    //Get query param for sorting and defaults to department
    const sortBy = req.query.sort || 'department';
    //Get sorted faculty members - turns object into an array and sorts it
    const facultyMembers = await getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyMembers,
        currentSort: sortBy
    });
};

const facultyDetailPage = async(req, res, next) => {
    // Get facultyId from route parameters
    const facultySlug = req.params.facultySlug;
    // Look up faculty member by ID ^
    const facultyMember = await getFacultyBySlug(facultySlug);
    // If faculty member doesn't exist, create 404 error
    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        //Takes you to the global error handler middleware
        return next(err);
    }
    res.render('faculty/details', {
        title: facultyMember.name,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };