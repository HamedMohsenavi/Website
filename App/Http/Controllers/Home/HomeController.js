// Node Native
const path = require('path');
const fs = require('fs');

// Node Modules
const bcrypt = require('bcrypt');
const request = require('request-promise');
const sm = require('sitemap');
const RSS = require('rss');
const striptags = require('striptags');

// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Course = require('App/Models/Course');
const Episode = require('App/Models/Episode');
const Comment = require('App/Models/Comment');
const Category = require('App/Models/Category');
const Payment = require('App/Models/Payment');

class HomeController extends Controller
{
    async Index(Request, Response)
    {
        const _Course = await Course.find({ Lang: Request.getLocale() }).sort({ createdAt: 1 }).limit(10).exec();

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

            return Response.render('Home/Course', { Title: _Course.Title, Course: _Course, Categories: _Category });
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

    async Payment(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.body.Course);

            const _Course = await Course.findById(Request.body.Course);

            if (!_Course)
                this.SetError('Course Not Found', 404);

            if (await Request.user.IsPurchased(_Course._id))
            {
                Request.flash('Errors', 'You have purchased this course.');
                return Response.redirect('back');
            }

            if (_Course.Price === 0 && (_Course.Type === 'Vip' || _Course.Type === 'Free'))
            {
                Request.flash('Errors', 'You can\'t buy this course.');
                return Response.redirect('back');
            }

            // Zarinpal
            let Parameters =
            {
                MerchantID: process.env.ZARINPAL_MERCHANT_ID,
                Amount: _Course.Price,
                CallbackURL: `${process.env.WEBSITE_URL}/Course/Payment/Check`,
                Description: _Course.Title,
                Email: Request.user.Email
            };

            // Request promise
            let Options =
            {
                method: 'POST',
                uri: 'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
                headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
                body: Parameters,
                json: true
            };

            request(Options).then(async Data =>
            {
                await new Payment({ Account: Request.user._id, Course: _Course._id, Authority: Data.Authority, Price: _Course.Price }).save();
                Response.redirect(`https://www.zarinpal.com/pg/StartPay/${Data.Authority}`);
            }).catch(Error => Next(Error));
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Check(Request, Response, Next)
    {
        try
        {
            if (Request.query.Status && Request.query.Status !== 'OK')
                return Response.json('Payment False');

            const _Payment = await Payment.findOne({ Authority: Request.query.Authority }).populate('Course').exec();

            if (!_Payment.Course)
                return Response.json('Payment False');

            // Zarinpal
            let Parameters =
            {
                MerchantID: process.env.ZARINPAL_MERCHANT_ID,
                Amount: _Payment.Course.Price,
                Authority: Request.query.Authority
            };

            // Request promise
            let Options =
            {
                method: 'POST',
                uri: 'https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json',
                headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
                body: Parameters,
                json: true
            };

            request(Options).then(async Data =>
            {
                if (Data.Status === 100)
                {
                    _Payment.set({ Payment: true });
                    Request.user.Purchase.push(_Payment.Course._id);

                    await _Payment.save();
                    await Request.user.save();

                    Response.redirect(_Payment.Course.Path());
                }
                else
                    Response.json('Payment False');
            }).catch(Error => Next(Error));
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    CheckHash(Request, Episode)
    {
        let TimeStamps = new Date().getTime();

        if (Request.query.TimeStamps < TimeStamps)
            this.SetError('Your link has expired', 403);

        let SecretKey = process.env.DOWNLOAD_SECRET_KEY + Episode._id + Request.query.TimeStamps;

        return bcrypt.compareSync(SecretKey, Request.query.Mac);
    }

    async SiteMap(Request, Response, Next)
    {
        try
        {
            let SiteMap = sm.createSitemap(
            {
                hostname: process.env.WEBSITE_URL,
                cacheTime: 600000
            });

            SiteMap.add({ url: '/', changefreq: 'daily', priority: 1 });
            SiteMap.add({ url: '/Courses', changefreq: 'weekly', priority: 1 });

            const Courses = await Course.find({ }).sort({ createdAt: -1 }).exec();
            const Episodes = await Episode.find({ }).populate('Course').sort({ createdAt: -1 }).exec();

            Courses.forEach(Course => SiteMap.add({ url: Course.Path(), changefreq: 'weekly', priority: 0.8 }));
            Episodes.forEach(Episode => SiteMap.add({ url: Episode.Path(), changefreq: 'weekly', priority: 0.8 }));

            Response.header('Content-Type', 'application/xml');
            Response.send(SiteMap.toString());
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async FeedCourses(Request, Response, Next)
    {
        try
        {
            let Feed = new RSS(
            {
                title: 'Feed Course',
                description: 'RSS Course',
                feed_url: `${process.env.WEBSITE_URL}/Feed/Courses`,
                site_url: process.env.WEBSITE_URL
            });

            const Courses = await Course.find({ }).populate('Account').sort({ createdAt: -1 }).exec();

            Courses.forEach(Course =>
            {
                Feed.item(
                {
                    title: Course.Title,
                    description: striptags(Course.Description.substr(0, 100)),
                    date: Course.createdAt,
                    url: process.env.WEBSITE_URL + Course.Path(),
                    author: Course.Account.Name
                });
            });

            Response.header('Content-Type', 'application/xml');
            Response.send(Feed.xml());
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async FeedEpisodes(Request, Response, Next)
    {
        try
        {
            let Feed = new RSS(
            {
                title: 'Feed Episode',
                description: 'RSS Episode',
                feed_url: `${process.env.WEBSITE_URL}/Feed/Episodes`,
                site_url: process.env.WEBSITE_URL
            });

            const Episodes = await Episode.find({ }).populate({ path: 'Course', populate: 'Account' }).sort({ createdAt: -1 }).exec();

            Episodes.forEach(Episode =>
            {
                Feed.item(
                {
                    title: Episode.Title,
                    description: striptags(Episode.Description.substr(0, 100)),
                    date: Episode.createdAt,
                    url: process.env.WEBSITE_URL + Episode.Path(),
                    author: Episode.Course.Account.Name
                });
            });

            Response.header('Content-Type', 'application/xml');
            Response.send(Feed.xml());
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new HomeController();
