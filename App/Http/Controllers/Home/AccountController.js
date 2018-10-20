// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Model
const Payment = require('App/Models/Payment');

class AccountController extends Controller
{
    Index(Request, Response, Next)
    {
        try
        {
            Response.render('Home/Account', { Title: 'Account Page' });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async History(Request, Response, Next)
    {
        try
        {
            const _Payment = await Payment.Paginate({ Account: Request.user._id }, { page: Request.query.Page || 1, sort: { createdAt: -1 }, limit: 10, populate: 'Course' });

            Response.render('Home/Account/History', { Title: 'History Page', Payments: _Payment });
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new AccountController();
