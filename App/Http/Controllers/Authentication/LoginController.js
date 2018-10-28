// Node Module
const passport = require('passport');

// Controller
const Controller = require('App/Http/Controllers/Controller');

// Model
const Activation = require('App/Models/Activation');

// Helper
const Unique = require('App/Helpers/Unique');
const Mail = require('App/Helpers/Mail');

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

        return Response.redirect('back');
    }

    async Login(Request, Response, Next)
    {
        passport.authenticate('Login', async(Error, _Account) =>
        {
            if (!_Account)
                return Response.redirect('back');

            if (!_Account.Active)
            {
                const _Activation = await Activation.find({ Account: _Account._id }).gt('ExpireTime', new Date()).sort({ createdAt: 1 }).populate('Account').limit(1).exec();

                if (_Activation.length)
                {
                    Request.flash('Error', 'Active -_- 2');
                    return Response.redirect('back');
                }
                else
                {
                    const __Activation = new Activation({ Account: _Account._id, Token: Unique.String(30), ExpireTime: Date.now() + 1000 * 60 * 15 });

                    await __Activation.save();

                    // setup email data with unicode symbols
                    let MailOptions =
                    {
                        from: '"VectorCore 👻" <Info@Info.Com>',
                        to: `${_Account.Email}`,
                        subject: 'Active Account ✔',
                        html:
                        `
                            <h2>Active Account</h2>
                            <p>To Active your account, click on the link below</p>
                            <a href="${process.env.WEBSITE_URL}/Account/Activation/${__Activation.Token}">Active</a>
                        `
                    };

                    Mail.sendMail(MailOptions, (Error, Info) =>
                    {
                        if (Error)
                            return console.log(Error);

                        console.log('Message sent: %s', Info.messageId);

                        return Response.redirect('/');
                    });

                    return;
                }
            }

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
