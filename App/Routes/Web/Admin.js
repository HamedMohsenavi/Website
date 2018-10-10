// Node Modules
const Router = require('express').Router();

// Controllers
const CourseController = require('App/Http/Controllers/Admin/CourseController');
const EpisodeController = require('App/Http/Controllers/Admin/EpisodeController');

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
Router.delete('/Courses/:ID', CourseController.Destroy);
Router.get('/Courses/Create', CourseController.CreateIndex);
Router.post('/Courses/Create', Upload.single('Image'), Convert.FileToField, AdminValidator.CreateAndEditCourse(), CourseController.CreateProcess);
Router.get('/Courses/Edit/:ID', CourseController.EditIndex);
Router.put('/Courses/Edit/:ID', Upload.single('Image'), Convert.FileToField, AdminValidator.CreateAndEditCourse(), CourseController.EditProcess);

// Episodes Routers
Router.get('/Episodes', EpisodeController.Index);
Router.delete('/Episodes/:ID', EpisodeController.Destroy);
Router.get('/Episodes/Create', EpisodeController.CreateIndex);
Router.post('/Episodes/Create', AdminValidator.CreateEpisode(), EpisodeController.CreateProcess);

module.exports = Router;
