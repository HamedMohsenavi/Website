// Controllers
const Controller = require('App/Http/Controllers/Controller');

class HomeController extends Controller
{
    Index(Request, Response)
    {
        Response.json('Home Controller');
    }
}

module.exports = new HomeController();
