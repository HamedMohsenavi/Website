// Node Modules
const Router = require('express').Router();

// Controllers
const HomeController = require('App/Http/Controllers/Home/HomeController');

Router.get('/', HomeController.Index);

module.exports = Router;
