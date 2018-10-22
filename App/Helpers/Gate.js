// Node Module
const ConnectRoles = require('connect-roles');

// Model
const Permission = require('App/Models/Permission');

const Gate = new ConnectRoles(
{
    failureHandler: function(Request, Response, Action)
    {
        let Accept = Request.headers.accept || '';

        Response.locals.layout = 'Errors/Layout';
        Response.status(403);

        if (Accept.indexOf('html'))
            Response.render('Errors/403', { Action });
        else
            Response.json(`Access Denied - You don't have permission to: ${Action}`);
    }
});

const Permissions = async() =>
{
    const _Permission = await Permission.find({}).populate('Roles').exec();
    return _Permission;
};

Permissions().then(Permissions =>
{
    Permissions.forEach(Permission =>
    {
        let Roles = Permission.Roles.map(Role => Role._id);

        Gate.use(Permission.Name, Request =>
        {
            return Request.isAuthenticated() ? Request.user.HasRole(Roles) : false;
        });
    });
});

module.exports = Gate;
