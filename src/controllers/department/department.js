import {getCoursesByDepartment} from '../../models/catalog/catalog.js';

// Route handler for the department overview page
const departmentPage = (req, res) => {
    const departments = getCoursesByDepartment();
    res.render('department', {
        title: 'Departments',
        departments: departments
    });
};

export { departmentPage };