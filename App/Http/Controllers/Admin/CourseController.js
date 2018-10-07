// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Course = require('App/Models/Course');

class CourseController extends Controller
{
    Index(Request, Response)
    {
        Response.render('Admin/Courses', { Title: 'Course Page' });
    }

    CreateIndex(Request, Response)
    {
        Response.render('Admin/Courses/Create', { Title: 'Create Course Page' });
    }

    async CreateProcess(Request, Response, Next)
    {
        let Result = await this.ValidateData(Request);

        if (!Result)
        {
            Request.flash('GetFormData', Request.body);
            return Response.redirect('back');
        }

        let { Title, Slug, Image, Type, Description, Price, Tags } = Request.body;

        await new Course({ Account: Request.user._id, Title, Slug: this.Slug(Slug), Type, Image, Description, Price, Tags }).save();

        return Response.redirect('/Admin/Courses');
    }
}

module.exports = new CourseController();
