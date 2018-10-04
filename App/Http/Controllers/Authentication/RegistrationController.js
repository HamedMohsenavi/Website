// Controllers
const Controller = require('App/Http/Controllers/Controller');

class RegistrationController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/Registration', { Title: 'Registration Page', Errors: Request.flash('Errors') });
    }

    async Process(Request, Response, Next)
    {
        let Result = await this.ValidateData(Request);

        if (Result)
            return Response.json('Registration');

        return Response.redirect('/Authentication/Registration');
    }
}

module.exports = new RegistrationController();
