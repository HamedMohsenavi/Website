// Node Modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Models
const Account = require('App/Models/Account');

// Helpers
const Unique = require('App/Helpers/Unique');

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

        const AutoLogin = new Account({ ...Request.body });

        AutoLogin.save(Error =>
        {
            if (Error)
                return Done(Error, false, Request.flash('Errors', 'An error was occurred while registering your account. Please contact the Support'));

            Done(null, AutoLogin);
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

passport.use(new GoogleStrategy(
{
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
},
(Token, RefreshToken, Profile, Done) =>
{
    Account.findOne({ Email: Profile.emails[0].value }, (Error, _Account) =>
    {
        if (Error)
            return Done(Error);

        if (_Account)
            return Done(null, _Account);

        const AutoLogin = new Account({ Name: Profile.displayName, Email: Profile.emails[0].value, Password: Unique.String(30) });

        AutoLogin.save(Error =>
        {
            if (Error)
                throw Error;

            Done(null, AutoLogin);
        });
    });
}));
