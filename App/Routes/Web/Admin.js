// Node Modules
const Router = require('express').Router();

// Set Admin Layout
Router.use((Request, Response, Next) =>
{
    Response.locals.layout = 'Admin/Layout';
    Next();
});

// Controllers
const AdminController = require('App/Http/Controllers/Admin/AdminController');

Router.get('/', AdminController.Index);

module.exports = Router;
