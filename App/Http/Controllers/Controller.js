const { validationResult } = require('express-validator/check');

class Controller
{
    constructor()
    {
        Bind(this);
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
