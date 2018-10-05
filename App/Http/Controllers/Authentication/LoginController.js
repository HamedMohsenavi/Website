// Node Modules
const passport = require('passport');

// Controllers
const Controller = require('App/Http/Controllers/Controller');

class LoginController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/Login', { Recaptcha: this.Recaptcha.render(), Title: 'Login Page' });
    }

    async Process(Request, Response, Next)
    {
        await this.ValidateRecaptcha(Request, Response);

        let Result = await this.ValidateData(Request);

        if (Result)
            return this.Login(Request, Response, Next);

        return Response.redirect('/Authentication/Login');
    }

    Login(Request, Response, Next)
    {
        passport.authenticate('Login', (Error, _Account) =>
        {
            if (!_Account)
                return Response.redirect('/Authentication/Login');

            Request.login(_Account, Error =>
            {
                if (Request.body.Remember)
                    _Account.SetRemember(Response);

                return Response.redirect('/');
            });
        })(Request, Response, Next);
    }
}

module.exports = new LoginController();
