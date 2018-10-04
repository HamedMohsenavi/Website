// Node Modules
const Router = require('express').Router();

// Controllers
const AdminController = require('App/Http/Controllers/Admin/AdminController');

Router.get('/', AdminController.Index);

module.exports = Router;
