// Node Native
const path = require('path');

// Node Module
const moment = require('moment');

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
            GetFormData: this.GetFormData,
            GetDate: this.GetDate
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

    GetDate(Time)
    {
        return moment(Time);
    }
}

module.exports = Helper;
