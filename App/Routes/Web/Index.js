// Node Modules
const Router = require('express').Router();

// Middleware
const Redirect = require('App/Http/Middleware/Redirect');

// Home Routers
Router.use('/', require('./Home'));

// Admin Routers
Router.use('/Admin', Redirect.IsAdmin, require('./Admin'));

// Authentication Routers
Router.use('/Authentication', Redirect.IsAuthenticated, require('./Authentication'));

module.exports = Router;
