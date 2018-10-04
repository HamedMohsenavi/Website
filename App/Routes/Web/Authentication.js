// Node Modules
const Router = require('express').Router();

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

module.exports = Router;
