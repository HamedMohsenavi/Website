// Models
const Account = require('App/Models/Account');

// Middleware
const Middleware = require('./Middleware');

class Login extends Middleware
{
    Handle(Request, Response, Next)
    {
        if (!Request.isAuthenticated())
        {
            const Remember = Request.signedCookies.Remember;

            if (Remember)
                return this.FindUser(Request, Remember, Next);
        }

        Next();
    }

    FindUser(Request, Remember, Next)
    {
        Account.findOne({ Remember }).then(_Account =>
        {
            if (_Account)
            {
                Request.login(_Account, Error =>
                {
                    if (Error)
                        Next(Error);

                    Next();
                });
            }
            else
                Next();
        }).catch(Error => Next(Error));
    }
}

module.exports = new Login();
