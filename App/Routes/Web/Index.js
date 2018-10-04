// Node Modules
const Router = require('express').Router();

// Home Routers
Router.use('/', require('./Home'));

// Admin Routers
Router.use('/Admin', require('./Admin'));

// Authentication Routers
Router.use('/Authentication', require('./Authentication'));

module.exports = Router;
