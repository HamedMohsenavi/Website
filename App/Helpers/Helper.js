// Node Native
const path = require('path');

class Helper
{
    constructor(Request)
    {
        Bind(this);
        this.Request = Request;
        this.FormData = Request.flash('GetFormData')[0];
    }

    GetObjects()
    {
        return {
            Errors: this.Request.flash('Errors'),
            Request: this.Request,
            ViewPath: this.ViewPath,
            GetFormData: this.GetFormData
        };
    }

    ViewPath(Directory)
    {
        return path.resolve(`./Resource/Views/${Directory}`);
    }

    GetFormData(Field, Default = '')
    {
        return this.FormData && this.FormData.hasOwnProperty(Field) ? this.FormData[Field] : Default;
    }
}

module.exports = Helper;
