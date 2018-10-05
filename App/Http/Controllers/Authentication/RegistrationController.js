// Controllers
const Controller = require('App/Http/Controllers/Controller');

class RegistrationController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/Registration', { Recaptcha: this.Recaptcha.render(), Title: 'Registration Page', Errors: Request.flash('Errors') });
    }

    async Process(Request, Response, Next)
    {
        await this.ValidateRecaptcha(Request, Response);

        let Result = await this.ValidateData(Request);

        if (Result)
            return Response.json('Registration');

        return Response.redirect('/Authentication/Registration');
    }
}

module.exports = new RegistrationController();
