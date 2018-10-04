// Node Modules
const Router = require('express').Router();

// Home Routers
Router.use('/', require('./Home'));

// Admin Routers
Router.use('/Admin', require('./Admin'));

module.exports = Router;
