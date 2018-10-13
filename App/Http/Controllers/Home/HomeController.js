// Node Native
const path = require('path');
const fs = require('fs');

// Node Modules
const bcrypt = require('bcrypt');

// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Course = require('App/Models/Course');
const Episode = require('App/Models/Episode');
const Comment = require('App/Models/Comment');

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
            const _Course = await Course.findOne({ Slug: Request.params.Slug }).populate([{ path: 'Account', select: 'Name' }, { path: 'Episodes', options: { sort: { EpisodeNumber: 1 } } }, { path: 'Comments', match: { Parent: { $eq: null }, Approved: { $eq: true } }, populate: [{ path: 'Account', select: 'Name' }, { path: 'Children', match: { Approved: { $eq: true } }, populate: [{ path: 'Account', select: 'Name' }] }] }]);

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

    async DownloadEpisode(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            if (!Request.isAuthenticated())
                return Response.redirect('/Authentication/Login');

            let _Episode = await Episode.findById(Request.params.ID);

            if (!_Episode)
                this.SetError('Episode Not Found', 404);

            if (!this.CheckHash(Request, _Episode))
                this.SetError('Your link has expired', 403);

            let FilePath = path.resolve(`./Resource/Storage/Courses/${_Episode.FileName}`);

            if (!fs.existsSync(FilePath))
                this.SetError('Episode Not Found', 404);

            return Response.download(FilePath);
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Comment(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            let _Comment = new Comment({ Account: Request.user._id, ...Request.body });

            _Comment.Approved = false;
            await _Comment.save();

            return Response.redirect('back');
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

    CheckHash(Request, Episode)
    {
        let TimeStamps = new Date().getTime();

        if (Request.query.TimeStamps < TimeStamps)
            this.SetError('Your link has expired', 403);

        let SecretKey = process.env.DOWNLOAD_SECRET_KEY + Episode._id + Request.query.TimeStamps;

        return bcrypt.compareSync(SecretKey, Request.query.Mac);
    }
}

module.exports = new HomeController();
