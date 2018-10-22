// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Account = require('App/Models/Account');
const Role = require('App/Models/Role');

class AccountController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Account = await Account.Paginate({ }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10 });
            Response.render('Admin/Account', { Title: 'Account Page', Accounts: _Account });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Access(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Account = await Account.findById(Request.params.ID);

            if (!_Account)
                this.SetError('Account Not Found', 404);

            await _Account.set({ Admin: !_Account.Admin }).save();

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async AddRoleIndex(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Account = await Account.findById(Request.params.ID);
            const _Role = await Role.find({ });

            if (!_Account)
                this.SetError('Account Not Found', 404);

            Response.render('Admin/Account/AddRole', { Title: 'Add Role Page', Account: _Account, Roles: _Role });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async AddRoleProcess(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Account = await Account.findById(Request.params.ID);

            if (!_Account)
                this.SetError('Account Not Found', 404);

            await _Account.set({ Roles: Request.body.Roles }).save();

            return Response.redirect('/Admin/Accounts');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Destroy(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Account = await Account.findById(Request.params.ID).populate({ path: 'Courses', populate: ['Episodes'] }).exec();

            if (!_Account)
                this.SetError('Account Not Found', 404);

            // Delete Course & Episode
            _Account.Courses.forEach(Course =>
            {
                Course.Episodes.forEach(Episode => Episode.remove());
                Course.remove();
            });

            // Delete Account
            _Account.remove();

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new AccountController();
