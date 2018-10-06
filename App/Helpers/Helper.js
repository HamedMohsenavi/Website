// Node Native
const path = require('path');

class Helper
{
    constructor(Request)
    {
        Bind(this);
        this.Request = Request;
    }

    GetObjects()
    {
        return {
            Errors: this.Request.flash('Errors'),
            Request: this.Request,
            ViewPath: this.ViewPath
        };
    }

    ViewPath(Directory)
    {
        return path.resolve(`./Resource/Views/${Directory}`);
    }
}

module.exports = Helper;
