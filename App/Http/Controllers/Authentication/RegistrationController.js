// Node Modules
const passport = require('passport');

// Controllers
const Controller = require('App/Http/Controllers/Controller');

class RegistrationController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/Registration', { Recaptcha: this.Recaptcha.render(), Title: 'Registration Page' });
    }

    async Process(Request, Response, Next)
    {
        await this.ValidateRecaptcha(Request, Response);

        let Result = await this.ValidateData(Request);

        if (Result)
            return this.Register(Request, Response, Next);

        return Response.redirect('/Authentication/Registration');
    }

    Register(Request, Response, Next)
    {
        passport.authenticate('Registration',
        {
            successRedirect: '/Authentication/Login',
            failureRedirect: '/Authentication/Registration',
            failureFlash: true
        })(Request, Response, Next);
    }
}

module.exports = new RegistrationController();
