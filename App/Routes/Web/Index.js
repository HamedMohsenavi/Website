// Node Modules
const Router = require('express').Router();
const i18n = require('i18n');

// Middleware
const Redirect = require('App/Http/Middleware/Redirect');
const ErrorHandler = require('App/Http/Middleware/ErrorHandler');

// Lang Middleware
Router.use((Request, Response, Next) =>
{
    try
    {
        let Lang = Request.signedCookies.Lang;

        if (i18n.getLocales().includes(Lang))
            Request.setLocale(Lang);
        else
            Request.setLocale(i18n.getLocale());

        Next();
    }
    catch (Error)
    {
        Next(Error);
    }
});

// Lang Router
Router.get('/Lang/:Lang', (Request, Response) =>
{
    let Lang = Request.params.Lang;

    if (i18n.getLocales().includes(Lang))
        Response.cookie('Lang', Lang, { maxAge: 1000 * 60 * 60 * 24 * 90, signed: true });

    Response.redirect('back');
});

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
