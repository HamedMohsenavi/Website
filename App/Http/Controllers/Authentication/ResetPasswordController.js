// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const PasswordRecovery = require('App/Models/PasswordRecovery');
const Account = require('App/Models/Account');

// Helpers
const Unique = require('App/Helpers/Unique');

class ResetPasswordController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/ResetPassword', { Recaptcha: this.Recaptcha.render(), Title: 'Reset Your Password' });
    }

    async Process(Request, Response, Next)
    {
        await this.ValidateRecaptcha(Request, Response);

        let Result = await this.ValidateData(Request);

        if (Result)
            return this.ResetPassword(Request, Response);

        return Response.redirect('back');
    }

    async ResetPassword(Request, Response)
    {
        let _Account = await Account.findOne({ Email: Request.body.Email });

        if (!_Account)
        {
            Request.flash('Errors', 'Sorry, We were unable to find an email that matched your search.');
            return Response.redirect('back');
        }

        await new PasswordRecovery({ Email: Request.body.Email, Token: Unique.String(30) }).save();

        return Response.redirect('/');
    }
}

module.exports = new ResetPasswordController();
