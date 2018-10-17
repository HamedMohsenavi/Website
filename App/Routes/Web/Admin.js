// Node Modules
const Router = require('express').Router();

// Controllers
const CourseController = require('App/Http/Controllers/Admin/CourseController');
const EpisodeController = require('App/Http/Controllers/Admin/EpisodeController');
const AdminController = require('App/Http/Controllers/Admin/AdminController');
const CommentController = require('App/Http/Controllers/Admin/CommentController');
const CategoryController = require('App/Http/Controllers/Admin/CategoryController');

// Validator
const AdminValidator = require('App/Http/Validators/AdminValidator');

// Set Admin Layout
Router.use((Request, Response, Next) =>
{
    Response.locals.layout = 'Admin/Layout';
    Next();
});

// Helpers
const Upload = require('App/Helpers/Upload');

// Middleware
const Convert = require('App/Http/Middleware/Convert');

Router.get('/', AdminController.Index);
Router.post('/Upload', Upload.single('upload'), AdminController.UploadImage);

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
Router.post('/Episodes/Create', AdminValidator.CreateAndEditEpisode(), EpisodeController.CreateProcess);
Router.get('/Episodes/Edit/:ID', EpisodeController.EditIndex);
Router.put('/Episodes/Edit/:ID', AdminValidator.CreateAndEditEpisode(), EpisodeController.EditProcess);

// Comments Routers
Router.get('/Comments', CommentController.Index);
Router.delete('/Comments/:ID', CommentController.Destroy);
Router.get('/Comments/Approved', CommentController.ApprovedIndex);
Router.put('/Comments/Approved/:ID', CommentController.ApprovedProcess);

// Categories Routers
Router.get('/Categories', CategoryController.Index);
Router.delete('/Categories/:ID', CategoryController.Destroy);
Router.get('/Categories/Create', CategoryController.CreateIndex);
Router.post('/Categories/Create', AdminValidator.CreateAndEditCategory(), CategoryController.CreateProcess);
Router.get('/Categories/Edit/:ID', CategoryController.EditIndex);
Router.put('/Categories/Edit/:ID', AdminValidator.CreateAndEditCategory(), CategoryController.EditProcess);

module.exports = Router;
