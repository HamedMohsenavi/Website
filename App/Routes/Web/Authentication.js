// Node Modules
const Router = require('express').Router();
const passport = require('passport');

// Controllers
const LoginController = require('App/Http/Controllers/Authentication/LoginController');
const RegistrationController = require('App/Http/Controllers/Authentication/RegistrationController');
const PasswordRecoveryController = require('App/Http/Controllers/Authentication/PasswordRecoveryController');
const ResetPasswordController = require('App/Http/Controllers/Authentication/ResetPasswordController');

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

// Password Recovery Routers
Router.get('/Password/Recovery/:Token', PasswordRecoveryController.Index);
Router.post('/Password/Recovery', AuthenticationValidator.PasswordRecovery(), PasswordRecoveryController.Process);

// Reset Password
Router.get('/Reset/Password', ResetPasswordController.Index);
Router.post('/Reset/Password', AuthenticationValidator.ResetPassword(), ResetPasswordController.Process);

module.exports = Router;
