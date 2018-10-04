// Controllers
const Controller = require('App/Http/Controllers/Controller');

class HomeController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Home', { Title: 'Home Page' });
    }
}

module.exports = new HomeController();
