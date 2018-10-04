// Controllers
const Controller = require('App/Http/Controllers/Controller');

class AdminController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Admin', { Title: 'Admin Page' });
    }
}

module.exports = new AdminController();
