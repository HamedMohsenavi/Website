// Node Modules
const Router = require('express').Router();

// Middleware
const Redirect = require('App/Http/Middleware/Redirect');
const ErrorHandler = require('App/Http/Middleware/ErrorHandler');

// Home Routers
Router.use('/', require('./Home'));

// Admin Routers
Router.use('/Admin', Redirect.IsAdmin, require('./Admin'));

// Authentication Routers
Router.use('/Authentication', Redirect.IsAuthenticated, require('./Authentication'));

// Error Handler
Router.get('*', ErrorHandler.E404);
Router.use(ErrorHandler.Index);

module.exports = Router;
