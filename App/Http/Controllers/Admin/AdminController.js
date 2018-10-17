// Controllers
const Controller = require('App/Http/Controllers/Controller');

class AdminController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Admin', { Title: 'Admin Page' });
    }

    UploadImage(Request, Response)
    {
        let Image = Request.file;

        Response.json({ 'uploaded': 1, 'fileName': Image.originalname, 'url': (`${Image.destination}/${Image.filename}`).substring(8) });
    }
}

module.exports = new AdminController();
