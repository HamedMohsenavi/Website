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
const Category = require('App/Models/Category');

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
            const _Course = await Course.findOneAndUpdate({ Slug: Request.params.Slug }, { $inc: { ViewCount: 1 } }).populate([{ path: 'Account', select: 'Name' }, { path: 'Episodes', options: { sort: { EpisodeNumber: 1 } } }, { path: 'Comments', match: { Parent: { $eq: null }, Approved: { $eq: true } }, populate: [{ path: 'Account', select: 'Name' }, { path: 'Children', match: { Approved: { $eq: true } }, populate: [{ path: 'Account', select: 'Name' }] }] }]);
            const _Category = await Category.find({ Parent: null }).populate('Children').exec();

            if (!_Course)
                this.SetError('Course Not Found', 404);

            let _HasAccess = await this.HasAccess(Request, _Course);

            return Response.render('Home/Course', { Title: _Course.Title, Course: _Course, HasAccess: _HasAccess, Categories: _Category });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async CoursesIndex(Request, Response)
    {
        let Query = { };
        let { Search, Type, Order, QCategory } = Request.query;

        if (Search)
            Query.Title = new RegExp(Search, 'gi');

        if (Type && Type !== 'All')
            Query.Type = Type;

        if (QCategory && QCategory !== 'All')
        {
            const _Category = await Category.findOne({ Slug: QCategory });

            if (_Category)
                Query.Categories = { $in: [ _Category._id ] };
        }

        let _Course = Course.find({ ...Query });

        if (Order)
            _Course.sort({ createdAt: -1 });

        _Course = await _Course.exec();

        const _Category = await Category.find({ });

        Response.render('Home/Courses', { Title: 'Courses Page', Courses: _Course, Categories: _Category });
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

            _Episode.Increase('DownloadCount');

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
                return Response.redirect('back');

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
