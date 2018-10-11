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
Router.get('/Course/Download/:ID', HomeController.DownloadEpisode);

module.exports = Router;
