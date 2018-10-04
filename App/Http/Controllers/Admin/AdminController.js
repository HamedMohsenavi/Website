// Controllers
const Controller = require('App/Http/Controllers/Controller');

class AdminController extends Controller
{
    Index(Request, Response)
    {
        Response.json('Admin Controller');
    }
}

module.exports = new AdminController();
