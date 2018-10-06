// Node Modules
const Router = require('express').Router();
const passport = require('passport');

// Controllers
const LoginController = require('App/Http/Controllers/Authentication/LoginController');
const RegistrationController = require('App/Http/Controllers/Authentication/RegistrationController');

// Authentication Validator
const AuthenticationValidator = require('App/Http/Validators/AuthenticationValidator');

// Login Routers
Router.get('/Login', LoginController.Index);
Router.post('/Login', AuthenticationValidator.Login(), LoginController.Process);

// Registration Routers
Router.get('/Registration', RegistrationController.Index);
Router.post('/Registration', AuthenticationValidator.Registration(), RegistrationController.Process);

// Google Routers
Router.get('/Google', passport.authenticate('google', { scope: ['profile', 'email'] }));
Router.get('/Google/Callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/Registration' }));

module.exports = Router;
