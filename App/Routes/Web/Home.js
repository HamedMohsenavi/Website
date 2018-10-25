// Node Modules
const Router = require('express').Router();

// Controllers
const HomeController = require('App/Http/Controllers/Home/HomeController');
const AccountController = require('App/Http/Controllers/Home/AccountController');

// Validator
const HomeValidator = require('App/Http/Validators/HomeValidator');

// Middleware
const Redirect = require('App/Http/Middleware/Redirect');

// Logout
Router.get('/Logout', (Request, Response) =>
{
    Request.logout();
    Response.clearCookie('Remember');
    Response.redirect('/');
});

// Site Map
Router.get('/SiteMap.xml', HomeController.SiteMap);

// Home Router
Router.get('/', HomeController.Index);

// Courses Router
Router.get('/Courses', HomeController.CoursesIndex);

// Single Course Routers
Router.get('/Course/:Slug', HomeController.CourseIndex);
Router.get('/Course/Download/:ID', HomeController.DownloadEpisode);

// Payment Routers
Router.post('/Course/Payment', Redirect.IsNotAuthenticated, HomeController.Payment);
Router.get('/Course/Payment/Check', Redirect.IsNotAuthenticated, HomeController.Check);

// Comment Router
Router.post('/Comment', Redirect.IsNotAuthenticated, HomeValidator.Comment(), HomeController.Comment);

// Account Routers
Router.get('/Account', Redirect.IsNotAuthenticated, AccountController.Index);
Router.get('/Account/History', Redirect.IsNotAuthenticated, AccountController.History);
Router.get('/Account/Vip', Redirect.IsNotAuthenticated, AccountController.VipIndex);
Router.post('/Account/Vip/Payment', Redirect.IsNotAuthenticated, AccountController.Payment);
Router.get('/Account/Vip/Payment/Check', Redirect.IsNotAuthenticated, AccountController.Check);

// Rss Routers
Router.get('/Feed/Courses', HomeController.FeedCourses);
Router.get('/Feed/Episodes', HomeController.FeedEpisodes);

module.exports = Router;
