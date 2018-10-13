// Node Modules
const Router = require('express').Router();

// Controllers
const HomeController = require('App/Http/Controllers/Home/HomeController');

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

Router.get('/', HomeController.Index);
Router.get('/Course/:Slug', HomeController.CourseIndex);
Router.get('/Course/Download/:ID', HomeController.DownloadEpisode);
Router.post('/Comment', Redirect.IsNotAuthenticated, HomeValidator.Comment(), HomeController.Comment);

module.exports = Router;
