// Node Modules
const Recaptcha = require('express-recaptcha').Recaptcha;
const { validationResult } = require('express-validator/check');

class Controller
{
    constructor()
    {
        Bind(this);
        this.RecaptchaConfiguration();
    }

    RecaptchaConfiguration()
    {
        this.Recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);
    }

    ValidateRecaptcha(Request, Response)
    {
        return new Promise((resolve) =>
        {
            this.Recaptcha.verify(Request, (error) =>
            {
                if (error)
                {
                    Request.flash('Errors', 'Incorrect Captcha. Try again.');
                    return Response.redirect('back');
                }

                resolve(true);
            });
        });
    }

    ValidateData(Request)
    {
        const Result = validationResult(Request);

        if (!Result.isEmpty())
        {
            const Errors = Result.array();
            const Messages = [];

            Errors.forEach(error => Messages.push(error.msg));

            Request.flash('Errors', Messages);

            return false;
        }

        return true;
    }
}

module.exports = Controller;
