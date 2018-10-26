// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const PasswordRecovery = require('App/Models/PasswordRecovery');
const Account = require('App/Models/Account');

// Helpers
const Unique = require('App/Helpers/Unique');
const Mail = require('App/Helpers/Mail');

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

        let _PasswordRecovery = new PasswordRecovery({ Email: Request.body.Email, Token: Unique.String(30) });

        _PasswordRecovery.save();

        // setup email data with unicode symbols
        let MailOptions =
        {
            from: '"VectorCore 👻" <Info@Info.Com>',
            to: `${Request.body.Email}`,
            subject: 'Reset Password ✔',
            html:
            `
                <h2>Reset Password</h2>
                <p>To reset your password, click on the link below</p>
                <a href="${process.env.WEBSITE_URL}/Authentication/Password/Recovery/${_PasswordRecovery.Token}">Reset</a>
            `
        };

        Mail.sendMail(MailOptions, (Error, Info) =>
        {
            if (Error)
                return console.log(Error);

            console.log('Message sent: %s', Info.messageId);

            return Response.redirect('/');
        });

        return Response.redirect('/');
    }
}

module.exports = new ResetPasswordController();
