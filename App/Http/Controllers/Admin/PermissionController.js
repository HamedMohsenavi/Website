// Controller
const Controller = require('App/Http/Controllers/Controller');

// Model
const Permission = require('App/Models/Permission');

class PermissionController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Permission = await Permission.Paginate({ }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10 });
            Response.render('Admin/Account/Permission', { Title: 'Permission Page', Permissions: _Permission });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async CreateIndex(Request, Response)
    {
        Response.render('Admin/Account/Permission/Create', { Title: 'Create Permission Page' });
    }

    async CreateProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            await new Permission({ ...Request.body }).save();

            return Response.redirect('/Admin/Accounts/Permissions');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async EditIndex(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Permission = await Permission.findById(Request.params.ID);

            if (!_Permission)
                this.SetError('Permission Not Found', 404);

            return Response.render('Admin/Account/Permission/Edit', { Title: 'Edit Permission Page', Permission: _Permission });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async EditProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            await Permission.findByIdAndUpdate(Request.params.ID, { $set: { ...Request.body } });

            return Response.redirect('/Admin/Accounts/Permissions');
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

            const _Permission = await Permission.findById(Request.params.ID);

            if (!_Permission)
                this.SetError('Permission Not Found', 404);

            // Delete Permission
            _Permission.remove();

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new PermissionController();
