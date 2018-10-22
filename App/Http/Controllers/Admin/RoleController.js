// Controller
const Controller = require('App/Http/Controllers/Controller');

// Models
const Permission = require('App/Models/Permission');
const Role = require('App/Models/Role');

class RoleController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Role = await Role.Paginate({ }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10 });
            Response.render('Admin/Account/Role', { Title: 'Role Page', Roles: _Role });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async CreateIndex(Request, Response)
    {
        const _Permission = await Permission.find({ });

        Response.render('Admin/Account/Role/Create', { Title: 'Create Role Page', Permissions: _Permission });
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

            await new Role({ ...Request.body }).save();

            return Response.redirect('/Admin/Accounts/Roles');
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

            const _Role = await Role.findById(Request.params.ID);
            const _Permission = await Permission.find({ });

            if (!_Role)
                this.SetError('Role Not Found', 404);

            return Response.render('Admin/Account/Role/Edit', { Title: 'Edit Role Page', Role: _Role, Permissions: _Permission });
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

            await Role.findByIdAndUpdate(Request.params.ID, { $set: { ...Request.body } });

            return Response.redirect('/Admin/Accounts/Roles');
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

            const _Role = await Role.findById(Request.params.ID);

            if (!_Role)
                this.SetError('Role Not Found', 404);

            // Delete Role
            _Role.remove();

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new RoleController();
