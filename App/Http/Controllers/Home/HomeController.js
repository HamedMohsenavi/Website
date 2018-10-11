// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Course = require('App/Models/Course');

class HomeController extends Controller
{
    async Index(Request, Response)
    {
        const _Course = await Course.find({}).sort({ createdAt: 1 }).limit(10).exec();

        Response.render('Home', { Title: 'Home Page', Courses: _Course });
    }

    async CourseIndex(Request, Response, Next)
    {
        try
        {
            const _Course = await Course.findOne({ Slug: Request.params.Slug }).populate([{ path: 'Account', select: 'Name' }, { path: 'Episodes', options: { sort: { EpisodeNumber: 1 } } }]);

            if (!_Course)
                this.SetError('Course Not Found', 404);

            let _HasAccess = await this.HasAccess(Request, _Course);

            return Response.render('Home/Course', { Title: _Course.Title, Course: _Course, HasAccess: _HasAccess });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async HasAccess(Request, Course)
    {
        let HasAccess = false;

        if (Request.isAuthenticated())
        {
            switch (Course.Type)
            {
                case 'Vip':
                    HasAccess = Request.user.IsVip();
                    break;

                case 'Cash':
                    HasAccess = Request.user.IsPurchased(Course);
                    break;

                default:
                    HasAccess = true;
                    break;
            }
        }

        return HasAccess;
    }
}

module.exports = new HomeController();
