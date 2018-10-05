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
            Request: this.Request
        };
    }
}

module.exports = Helper;
