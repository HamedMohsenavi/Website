// Controller
const Controller = require('App/Http/Controllers/Controller');

// Models
const PasswordRecovery = require('App/Models/PasswordRecovery');
const Account = require('App/Models/Account');

class PasswordRecoveryController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home/Authentication/PasswordRecovery', { Recaptcha: this.Recaptcha.render(), Title: 'Password Recovery', Token: Request.params.Token });
    }

    async Process(Request, Response, Next)
    {
        await this.ValidateRecaptcha(Request, Response);

        let Result = await this.ValidateData(Request);

        if (Result)
            return this.PasswordRecovery(Request, Response);

        return Response.redirect(`/Authentication/Password/Recovery/${Request.body.Token}`);
    }

    async PasswordRecovery(Request, Response)
    {
        let _PasswordRecovery = await PasswordRecovery.findOne({ $and: [{ Email: Request.body.Email }, { Token: Request.body.Token }] });

        if (!_PasswordRecovery)
        {
            Request.flash('Errors', 'Sorry, We were unable to find an email that matched your search.');
            return Response.redirect('back');
        }

        if (_PasswordRecovery.Expired)
        {
            Request.flash('Errors', 'Sorry, Recovery link has already been expired.');
            return Response.redirect('back');
        }

        let _Account = await Account.findOne({ Email: _PasswordRecovery.Email });

        _Account.$set({ Password: _Account.HashPassword(Request.body.Password) });
        await _Account.save();

        if (!_Account)
        {
            Request.flash('Errors', 'Sorry, An error was occurred while reseting your password. Please contact the Support.');
            return Response.redirect('back');
        }

        await _PasswordRecovery.updateOne({ Expired: true });

        return Response.redirect('/Authentication/Login');
    }
}

module.exports = new PasswordRecoveryController();
