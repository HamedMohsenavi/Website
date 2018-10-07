// Node Modules
const Router = require('express').Router();

// Controllers
const CourseController = require('App/Http/Controllers/Admin/CourseController');

// Validator
const AdminValidator = require('App/Http/Validators/AdminValidator');

// Set Admin Layout
Router.use((Request, Response, Next) =>
{
    Response.locals.layout = 'Admin/Layout';
    Next();
});

// Controllers
const AdminController = require('App/Http/Controllers/Admin/AdminController');

// Helpers
const Upload = require('App/Helpers/Upload');

// Middleware
const Convert = require('App/Http/Middleware/Convert');

Router.get('/', AdminController.Index);

// Courses Routers
Router.get('/Courses', CourseController.Index);
Router.get('/Courses/Create', CourseController.CreateIndex);
Router.post('/Courses/Create', Upload.single('Image'), Convert.FileToField, AdminValidator.CreateCourse(), CourseController.CreateProcess);

module.exports = Router;
