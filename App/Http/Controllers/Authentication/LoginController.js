// Controllers
const Controller = require('App/Http/Controllers/Controller');

class LoginController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/Login', { Recaptcha: this.Recaptcha.render(), Title: 'Login Page', Errors: Request.flash('Errors') });
    }

    async Process(Request, Response, Next)
    {
        await this.ValidateRecaptcha(Request, Response);

        let Result = await this.ValidateData(Request);

        if (Result)
            return Response.json('Login');

        return Response.redirect('/Authentication/Login');
    }
}

module.exports = new LoginController();
