// Node Modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Models
const Account = require('App/Models/Account');

passport.serializeUser(function(Account, Done)
{
    Done(null, Account.id);
});

passport.deserializeUser(function(ID, Done)
{
    Account.findById(ID, function(Error, Account)
    {
        Done(Error, Account);
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
    Account.findOne({ 'Email': Email }, (Error, Exists) =>
    {
        if (Error)
            return Done(Error);

        if (Exists)
            return Done(null, false, Request.flash('Errors', 'That email is taken. Try another.'));

        new Account({ ...Request.body }).save(Error =>
        {
            if (Error)
                return Done(Error, false, Request.flash('Errors', 'An error was occurred while registering your account. Please contact the Support'));

            Done(null, new Account());
        });
    });
}));
