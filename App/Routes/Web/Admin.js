// Node Module
const Router = require('express').Router();

// Controllers
const CourseController = require('App/Http/Controllers/Admin/CourseController');
const EpisodeController = require('App/Http/Controllers/Admin/EpisodeController');
const AdminController = require('App/Http/Controllers/Admin/AdminController');
const CommentController = require('App/Http/Controllers/Admin/CommentController');
const CategoryController = require('App/Http/Controllers/Admin/CategoryController');
const AccountController = require('App/Http/Controllers/Admin/AccountController');
const PermissionController = require('App/Http/Controllers/Admin/PermissionController');
const RoleController = require('App/Http/Controllers/Admin/RoleController');

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
const Gate = require('App/Helpers/Gate');

// Middleware
const Convert = require('App/Http/Middleware/Convert');

Router.get('/', AdminController.Index);
Router.post('/Upload', Upload.single('upload'), AdminController.UploadImage);

// Course Routers
Router.get('/Courses', CourseController.Index);
Router.delete('/Courses/:ID', CourseController.Destroy);
Router.get('/Courses/Create', CourseController.CreateIndex);
Router.post('/Courses/Create', Upload.single('Image'), Convert.FileToField, AdminValidator.CreateAndEditCourse(), CourseController.CreateProcess);
Router.get('/Courses/Edit/:ID', CourseController.EditIndex);
Router.put('/Courses/Edit/:ID', Upload.single('Image'), Convert.FileToField, AdminValidator.CreateAndEditCourse(), CourseController.EditProcess);

// Episode Routers
Router.get('/Episodes', EpisodeController.Index);
Router.delete('/Episodes/:ID', EpisodeController.Destroy);
Router.get('/Episodes/Create', EpisodeController.CreateIndex);
Router.post('/Episodes/Create', AdminValidator.CreateAndEditEpisode(), EpisodeController.CreateProcess);
Router.get('/Episodes/Edit/:ID', EpisodeController.EditIndex);
Router.put('/Episodes/Edit/:ID', AdminValidator.CreateAndEditEpisode(), EpisodeController.EditProcess);

// Comment Routers
Router.get('/Comments', Gate.can('ShowComments'), CommentController.Index);
Router.delete('/Comments/:ID', CommentController.Destroy);
Router.get('/Comments/Approved', CommentController.ApprovedIndex);
Router.put('/Comments/Approved/:ID', CommentController.ApprovedProcess);

// Category Routers
Router.get('/Categories', CategoryController.Index);
Router.delete('/Categories/:ID', CategoryController.Destroy);
Router.get('/Categories/Create', CategoryController.CreateIndex);
Router.post('/Categories/Create', AdminValidator.CreateAndEditCategory(), CategoryController.CreateProcess);
Router.get('/Categories/Edit/:ID', CategoryController.EditIndex);
Router.put('/Categories/Edit/:ID', AdminValidator.CreateAndEditCategory(), CategoryController.EditProcess);

// Account Routers
Router.get('/Accounts', AccountController.Index);
Router.delete('/Accounts/:ID', AccountController.Destroy);
Router.get('/Accounts/Access/:ID', AccountController.Access);
Router.get('/Accounts/AddRole/:ID', AccountController.AddRoleIndex);
Router.put('/Accounts/AddRole/:ID', AccountController.AddRoleProcess);

// Account Permission Routers
Router.get('/Accounts/Permissions', PermissionController.Index);
Router.delete('/Accounts/Permissions/:ID', PermissionController.Destroy);
Router.get('/Accounts/Permissions/Create', PermissionController.CreateIndex);
Router.post('/Accounts/Permissions/Create', AdminValidator.CreateAndEditPermission(), PermissionController.CreateProcess);
Router.get('/Accounts/Permissions/Edit/:ID', PermissionController.EditIndex);
Router.put('/Accounts/Permissions/Edit/:ID', AdminValidator.CreateAndEditPermission(), PermissionController.EditProcess);

// Account Role Routers
Router.get('/Accounts/Roles', RoleController.Index);
Router.delete('/Accounts/Roles/:ID', RoleController.Destroy);
Router.get('/Accounts/Roles/Create', RoleController.CreateIndex);
Router.post('/Accounts/Roles/Create', AdminValidator.CreateAndEditRole(), RoleController.CreateProcess);
Router.get('/Accounts/Roles/Edit/:ID', RoleController.EditIndex);
Router.put('/Accounts/Roles/Edit/:ID', AdminValidator.CreateAndEditRole(), RoleController.EditProcess);

module.exports = Router;
