// Node Modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Models
const Account = require('App/Models/Account');

passport.serializeUser(function(_Account, Done)
{
    Done(null, _Account.id);
});

passport.deserializeUser(function(ID, Done)
{
    Account.findById(ID, function(Error, _Account)
    {
        Done(Error, _Account);
    });
});

passport.use('Registration', new LocalStrategy(
{
    usernameField: 'Email',
    passwordField: 'Password',
    passReqToCallback: true
},
(Request, Email, Password, Done) =>
{
    Account.findOne({ 'Email': Email }, (Error, _Account) =>
    {
        if (Error)
            return Done(Error);

        if (_Account)
            return Done(null, false, Request.flash('Errors', 'That email is taken. Try another.'));

        new Account({ ...Request.body }).save(Error =>
        {
            if (Error)
                return Done(Error, false, Request.flash('Errors', 'An error was occurred while registering your account. Please contact the Support'));

            Done(null, new Account());
        });
    });
}));

passport.use('Login', new LocalStrategy(
{
    usernameField: 'Email',
    passwordField: 'Password',
    passReqToCallback: true
},
(Request, Email, Password, Done) =>
{
    Account.findOne({ 'Email': Email }, (Error, _Account) =>
    {
        if (Error)
            return Done(Error);

        if (!_Account || !_Account.ComparePassword(Password))
            return Done(null, false, Request.flash('Errors', 'The information entered is not correct'));

        Done(null, _Account);
    });
}));
