// Node Modules
const Router = require('express').Router();

// Controllers
const HomeController = require('App/Http/Controllers/Home/HomeController');

// Logout
Router.get('/Logout', (Request, Response) =>
{
    Request.logout();
    Response.clearCookie('Remember');
    Response.redirect('/');
});

Router.get('/', HomeController.Index);
Router.get('/Course/:Slug', HomeController.CourseIndex);

module.exports = Router;
