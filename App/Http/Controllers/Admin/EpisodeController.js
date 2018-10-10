// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Course = require('App/Models/Course');
const Episode = require('App/Models/Episode');

class EpisodeController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Episode = await Episode.Paginate({ }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10 });
            Response.render('Admin/Episodes', { Title: 'Episode Page', Episodes: _Episode });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async CreateIndex(Request, Response)
    {
        const _Course = await Course.find({ });

        Response.render('Admin/Episodes/Create', { Title: 'Create Episode Page', Courses: _Course });
    }

    async CreateProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            await new Episode({ ...Request.body }).save();

            // Update Course Time
            this.UpdateTime(Request.body.Course);

            return Response.redirect('/Admin/Episodes');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async EditIndex(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Episode = await Episode.findById(Request.params.ID);
            const _Course = await Course.find({ });

            if (!_Episode)
                this.SetError('Episode Not Found', 404);

            Response.render('Admin/Episodes/Edit', { Title: 'Edit Episode Page', Episode: _Episode, Courses: _Course });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async EditProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            let Previous = await Episode.findByIdAndUpdate(Request.params.ID, { $set: { ...Request.body } });

            // Update Course Time
            this.UpdateTime(Previous.Course);
            this.UpdateTime(Request.body.Course);

            return Response.redirect('/Admin/Episodes');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Destroy(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Episode = await Episode.findById(Request.params.ID);

            if (!_Episode)
                this.SetError('Episode Not Found', 404);

            // Delete Episode
            _Episode.remove();

            // Update Course Time
            this.UpdateTime(_Episode.Course);

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async UpdateTime(ID)
    {
        let _Course = await Course.findById(ID).populate('Episodes').exec();
        await _Course.set({ Time: this.GetTime(_Course.Episodes) }).save();
    }
}

module.exports = new EpisodeController();
