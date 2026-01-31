import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = (req, res) => {
    //Get query param for sorting and defaults to department
    const sortBy = req.query.sort || 'department';
    //Get sorted faculty members - turns object into an array and sorts it
    const facultyMembers = getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyMembers,
        currentSort: sortBy
    });
};

const facultyDetailPage = (req, res, next) => {
    // Get facultyId from route parameters
    const facultyId = req.params.facultyId;
    // Look up faculty member by ID ^
    const facultyMember = getFacultyById(facultyId);
    // If faculty member doesn't exist, create 404 error
    if (!facultyMember) {
        const err = new Error(`Faculty member ${facultyId} not found`);
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